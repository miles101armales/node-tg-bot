import { Context, Markup, Telegraf } from 'telegraf';
import { Command } from './command.class';
import { IBotContext } from '../context/context.interface';

export class SettingsCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}

	handle(): void {
		this.bot.command('settings', (ctx) => {
			if(ctx.session.email) {
				ctx.reply('Настройки выгрузки в разработке!', Markup.inlineKeyboard([
					Markup.button.callback('Вернуться в главное меню', 'start')
				]));
			} else {
				ctx.reply(`Кажется, вы у нас впервые! 😅\n\nВам необходимо закрепить почту для предоставления доступа к созданным таблицам. 😊\nНажмите на кнопку⬇️`, 
						{
							reply_markup: {
								inline_keyboard: [
									[ { text: '📥 Закрепить почту', callback_data: 'email_inline' } ]
								]
							}
						})
			}
		});
		this.bot.action('settings_inline', (ctx) => {
			if(ctx.session.email) {
				ctx.editMessageText('Настройки выгрузки в разработке!', Markup.inlineKeyboard([
					Markup.button.callback('Вернуться в главное меню', 'start')
				]));
			} else {
				ctx.reply(`Кажется, вы у нас впервые! 😅\n\nВам необходимо закрепить почту для предоставления доступа к созданным таблицам. 😊\nНажмите на кнопку⬇️`, 
						{
							reply_markup: {
								inline_keyboard: [
									[ { text: '📥 Закрепить почту', callback_data: 'email_inline' } ]
								]
							}
						})
			}
		});
		this.bot.action('start', (ctx) => {
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
		} )	
	}

	email(ctx: IBotContext): void {
		// try {
					
		// } catch (error) {
		// 	throw new Error('Ошибка вызова команды settings');
		// }
	}
}