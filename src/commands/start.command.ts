import { Markup, Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { Command } from './command.class';

export class StartCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	handle(): void {
		try {
			this.bot.start((ctx) => {
				try {
					if(ctx.session.email) {
						ctx.reply(
							`❤️ Добро пожаловать! Я бот-конвертер CSV-файлов в формат Google-таблиц.\n\nСписок моих комманд доступен по кнопке "Меню"\n\n ⬇️ Выберите действие:`,
							{
								reply_markup: {
									inline_keyboard: [
										[ { text: '⚡ Конвертировать', callback_data: 'convert_inline' }, { text: '🧷 Настройки выгрузки', callback_data: 'settings_inline' } ],
										[ { text: '📥 Изменить почту', callback_data: 'email_inline' } ]
									]
								}
							}
						)
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
				} catch (error) {
					this.bot.launch();
				}
			});
			this.bot.action('start', (ctx) => {
				ctx.reply(
					`❤️ Добро пожаловать! Я бот-конвертер CSV-файлов в формат Google-таблиц.\n\nСписок моих комманд доступен по кнопке "Меню"\n\n ⬇️ Выберите действие:`,
					{
						reply_markup: {
							inline_keyboard: [
								[ { text: '⚡ Конвертировать', callback_data: 'convert_inline' }, { text: '🧷 Настройки выгрузки', callback_data: 'settings_inline' } ],
								[ { text: '📥 Изменить почту', callback_data: 'email_inline' } ]
							]
						}
					}
				)
			})
			this.bot.action('start_back', (ctx) => {
				ctx.editMessageText(
					`Список моих комманд доступен по кнопке "Меню"\n\n ⬇️ Выберите действие:`,
					{
						reply_markup: {
							inline_keyboard: [
								[ { text: '⚡ Конвертировать', callback_data: 'convert_inline' }, { text: '🧷 Настройки выгрузки', callback_data: 'settings_inline' } ],
								[ { text: '📥 Изменить почту', callback_data: 'email_inline' } ]
							]
						}
					}
				)
			})
		} catch (error) {
			throw new Error('Ошибка вызова команды start');
		}
	}
}