import { Context, Markup, Telegraf } from 'telegraf';
import { Command } from './command.class';
import { IBotContext } from '../context/context.interface';
import { GoogleApiService } from '../google-api/google-api.service';
import axios, { spread } from 'axios';
import * as fs from 'fs';

export class ConvertCommand extends Command {
	filesCount = 0; // Инициализируем счетчик файлов
	googleSheetService: GoogleApiService;

	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
		this.googleSheetService = new GoogleApiService();
	}

	handle(): void {
		this.bot.command('convert', (ctx) => this.convert(ctx));
		this.bot.action('convert', (ctx) => this.convert(ctx));
	}

	convert(ctx: IBotContext): void {
		try {
			if(ctx.session.email) {
				ctx.reply('Вы попали в меню конвертации. Отправьте файл для конвертации:', );
				this.bot.on('document', async (ctx) => {
					this.filesCount++; // Увеличиваем счетчик при получении файла
		
					const fileId = ctx.message.document.file_id;
					const fileLink = await ctx.telegram.getFileLink(fileId); // Получаем прямую ссылку на файл
					const fileName = ctx.message.document.file_name;
		
					// Скачиваем файл с помощью Axios
					const response = await axios.get(String(fileLink), { responseType: 'stream' });
		
					// Создаем файл и записываем в него данные из потока
					const filePath = `csv/${fileName}`;
					const writer = fs.createWriteStream(filePath);
					response.data.pipe(writer);
		
					// Обработчик события окончания записи файла
					writer.on('finish', async () => {
						ctx.reply(`Файл ${fileName} успешно загружен и обработан.`);
		
						await this.googleSheetService.handleNewRequest(fileName as string, ctx.session.email, ctx.chat.id);
		
						this.filesCount--; // Уменьшаем счетчик при завершении обработки файла
		
						// Если все файлы были обработаны, отправляем сообщение
						if (this.filesCount === 0) {
							ctx.session.url_list = this.googleSheetService.spreadsheetUrl;
							this.bot.telegram.sendMessage(ctx.chat.id, `Ваша таблица: ${ctx.session.url_list}`, Markup.inlineKeyboard([
								Markup.button.callback('Вернуться в главное меню', 'start'),
							]))
						}
					});
		
					// Обработчик ошибок при записи файла
					writer.on('error', (error) => {
						console.error('Ошибка при записи файла:', error);
						ctx.reply('Произошла ошибка при загрузке файла.');
		
						this.filesCount--; // Уменьшаем счетчик при ошибке загрузки файла
					});
				});
				this.bot.action('start', (ctx) => {
					ctx.reply(
						`Список моих комманд доступен по кнопке "Меню"\n\n ⬇️ Выберите действие:`,
						{
							reply_markup: {
								inline_keyboard: [
									[ { text: '⚡ Конвертировать', callback_data: 'convert' }, { text: '🧷 Настройки выгрузки', callback_data: 'settings' } ],
									[ { text: '📥 Изменить почту', callback_data: 'email' } ]
								]
							}
						}
					)
				})
			} else {
				ctx.reply(`Кажется, вы у нас впервые! 😅\n\nВам необходимо закрепить почту для предоставления доступа к созданным таблицам. 😊\nНажмите на кнопку⬇️`, 
						{
							reply_markup: {
								inline_keyboard: [
									[ { text: '📥 Закрепить почту', callback_data: 'email' } ]
								]
							}
						})
			}
		} catch (error) {
			throw new Error('Ошибка вызова команды convert');
		}
	}
}