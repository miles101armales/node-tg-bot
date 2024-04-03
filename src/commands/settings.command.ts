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
				ctx.reply(`Ваши настройки:\n\n`+
				`#️⃣ Конвертация в таблицу:\n→ ${ctx.session.convert_to}\n`+
				`#️⃣ Выборка выгрузки:\n→ ${ctx.session.convert_settings}\n\n`+
				`Изменить настройку выгрузки?`, {
					reply_markup: {
						inline_keyboard: [[ { text: 'Изменить', callback_data: 'apply_email' } ],[ { text: '↩️ Вернуться в главное меню', callback_data: 'start_back' } ]]
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
		});
		this.bot.action('settings_inline', (ctx) => {
			if(ctx.session.email) {
				ctx.editMessageText(`Ваши настройки:\n\n`+
				`#️⃣ Конвертация в таблицу:\n→ ${ctx.session.convert_to}\n`+
				`#️⃣ Выборка выгрузки:\n→ ${ctx.session.convert_settings}\n\n`+
				`Изменить настройку выгрузки?`, {
					reply_markup: {
						inline_keyboard: [[ { text: 'Изменить', callback_data: 'apply_email' } ],
						[ { text: '↩️ Вернуться в главное меню', callback_data: 'start_back' } ]]
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
		});	
	}
}