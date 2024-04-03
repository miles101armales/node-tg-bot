import {  Markup, Telegraf } from 'telegraf';
import { Command } from './command.class';
import { IBotContext } from '../context/context.interface';
import { GoogleApiService } from '../google-api/google-api.service';
import axios from 'axios';
import * as fs from 'fs';
import { CsvService } from '../csv/csv.service';
import { Bot } from '../app';

export class ConvertCommand extends Command {
	filesCount = 0; // Инициализируем счетчик файлов
	googleSheetService: GoogleApiService;
	csvService: CsvService;
	Bot: Bot;

	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
		this.csvService = new CsvService();
		this.googleSheetService = new GoogleApiService();
	}

	handle(): void {
		this.bot.command('convert', (ctx) => {
			if(ctx.session.email) {
				ctx.reply(`Вы попали в меню конвертации.\nВаши настройки:\n\n` +  `📥 Ваша почта:\n→ ${ctx.session.email}\n`+
				`#️⃣ Конвертация в таблицу:\n→ ${ctx.session.convert_to}\n`+
				`#️⃣ Выборка выгрузки:\n→ ${ctx.session.convert_settings}\n\n` +` Выберите опцию:`, {
					reply_markup: {
						inline_keyboard: [
							[ { text: '#️⃣ Начать выгрузку', callback_data: 'convert_start' } ],
							[ { text: '🆕 Изменить настройки', callback_data: 'settings_inline' } ],
							[ { text: '↩️ Вернуться в главное меню', callback_data: 'start_back' } ]
						]
					}
				});
			} else {
				ctx.reply(`Кажется, вы у нас впервые! 😅\n\nВам необходимо пройти небольшую регистрацию для корректной работы с нашим ботом. 😊\nНажмите на кнопку⬇️`, 
						{
							reply_markup: {
								inline_keyboard: [
									[ { text: '🧩 Пройти регистрацию', callback_data: 'auth_inline' } ]
								]
							}
						})
			}
			this.convertSettings(ctx);
		});
		this.bot.action('convert_inline', (ctx) => {
			if(ctx.session.email) {
				ctx.editMessageText(`Вы попали в меню конвертации.\nВаши настройки:\n\n` +  `📥 Ваша почта:\n→ ${ctx.session.email}\n`+
				`#️⃣ Конвертация в таблицу:\n→ ${ctx.session.convert_to}\n`+
				`#️⃣ Выборка выгрузки:\n→ ${ctx.session.convert_settings}\n\n` +` Выберите опцию:`, {
					reply_markup: {
						inline_keyboard: [
							[ { text: '#️⃣ Начать выгрузку', callback_data: 'convert_start' } ],
							[ { text: '🆕 Изменить настройки', callback_data: 'settings_inline' } ],
							[ { text: '↩️ Вернуться в главное меню', callback_data: 'start_back' } ]
						]
					}
				});
			} else {
				ctx.reply(`Кажется, вы у нас впервые! 😅\n\nВам необходимо пройти небольшую регистрацию для корректной работы с нашим ботом. 😊\nНажмите на кнопку⬇️`, 
						{
							reply_markup: {
								inline_keyboard: [
									[ { text: '🧩 Пройти регистрацию', callback_data: 'auth_inline' } ]
								]
							}
						})
			}
			this.convertSettings(ctx);
		});
	}

	convertSettings(ctx: IBotContext): void {
		try {
				this.bot.action('convert_start', (ctx) => {
					ctx.editMessageText('Что выгружаем?', {
						reply_markup: {
							inline_keyboard: [
								[ { text: '#️⃣ Пользователи', callback_data: 'users' } ],
								[ { text: '🆕 Заказы', callback_data: 'orders' } ],
								[ { text: '↩️ Вернуться в главное меню', callback_data: 'start_back' } ]
							]
						}
					})
					this.bot.action('users', (ctx: IBotContext) => {
						ctx.session.convert_type = 'users';
						this.convertProcess(ctx);
					});
					this.bot.action('orders', (ctx: IBotContext) => {
						ctx.session.convert_type = 'orders';
						this.convertProcess(ctx);
					});
				})
		} catch (error) {
			throw new Error('Ошибка вызова команды convert');
		}
	}

	convertProcess(ctx_1: IBotContext): void {
		ctx_1.editMessageText('Отправьте ваш файл CSV')
		this.bot.on('document', async (ctx) => {
			try {
				this.filesCount++; // Увеличиваем счетчик при получении файла

				const fileId = ctx.message.document.file_id;
				const fileLink = await ctx.telegram.getFileLink(fileId); // Получаем прямую ссылку на файл
				const fileName = ctx.message.document.file_name;

				// Скачиваем файл с помощью Axios
				const response = await axios.get(String(fileLink), { responseType: 'stream' });

				// Создаем файл и записываем в него данные из потока
				const filePath = `downloads/${fileName}`;
				const writer = fs.createWriteStream(filePath);
				response.data.pipe(writer);
				
				// Обработка CSV файла
				if (ctx.session.convert_type === 'users') {
					await this.csvService.readCsvUser(fileName as string);
				} else if (ctx.session.convert_type === 'orders') {

					await this.csvService.readCsvOrder(fileName as string);
				}
				
				// Обработчик события окончания записи файла
				writer.on('finish', async () => {
					ctx.telegram.deleteMessage(ctx.chat.id, (ctx_1.msg.message_id))
					ctx.reply('Обработка файла ⌛')

					if(this.csvService.realArrOfObjects) {
						await this.googleSheetService.handleNewRequest(fileName as string, ctx.session.email, ctx.chat.id, this.csvService.realArrOfObjects)

						this.filesCount--; // Уменьшаем счетчик при завершении обработки файла

						// Если все файлы были обработаны, отправляем сообщение
						if (this.filesCount === 0) {
							ctx.session.url_list = this.googleSheetService.spreadsheetUrl;
							this.csvService.deleteCsvFile(filePath);
							ctx.telegram.deleteMessage(ctx.chat.id, (ctx.msg.message_id + 1))
							if(this.googleSheetService.statusOfImport === false) {
								ctx.reply('Что-то пошло не так 🤨\n\nПопробуйте еще раз 🙏 Проверьте какой тип выгрузки вы выбираете для файла.')
							} else {
								ctx.deleteMessage(ctx_1.message?.message_id);
								this.bot.telegram.sendMessage(ctx.chat.id, `Ваша таблица: ${ctx.session.url_list}`, Markup.inlineKeyboard([
									Markup.button.callback('Вернуться в главное меню', 'start'),
								]))
							}
						}
					}
				});

				// Обработчик ошибок при записи файла
				writer.on('error', (error) => {
					console.error('Ошибка при записи файла:', error);
					ctx.reply('Произошла ошибка при загрузке файла.');

					this.filesCount--; // Уменьшаем счетчик при ошибке загрузки файла
				});
			} catch (err) {
				ctx.reply('Для конвертации используйте метод /convert')
				this.Bot.restartBot();
			}
		});
	}
}