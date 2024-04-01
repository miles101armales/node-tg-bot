import { Context, Markup, Telegraf } from 'telegraf';
import { Command } from './command.class';
import { IBotContext } from '../context/context.interface';

export class EmailCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}

	handle(): void {
		this.bot.command('email', (ctx) => this.email(ctx));
		this.bot.action('email', (ctx) => this.email(ctx));
	}

	email(ctx: IBotContext): void {
		try {
				console.log('Perehod')
				if(ctx.session.email){
					ctx.editMessageText('Введите новую почту:', Markup.inlineKeyboard([
						Markup.button.callback('Вернуться в главное меню', 'start')
					]));
				} else {
					ctx.editMessageText('Здравствуйте! Для начала введите вашу почту для доступа к Google-таблицам:', Markup.inlineKeyboard([
						Markup.button.callback('Вернуться в главное меню', 'start')
					]));
				}
				this.bot.hears(/.*?/, async (ctx) => {
					ctx.reply(`Your email address is: ${ctx.update.message.text}`, Markup.inlineKeyboard([
						Markup.button.callback('Потдвердить!', 'start'),
						Markup.button.callback('Изменить', 'restart')
					]));
					ctx.session.email = ctx.update.message.text as string;
				});

			this.bot.action('start', (ctx) => {
				ctx.editMessageText(
					`Добро пожаловать! Я бот-конвертер CSV-файлов в формат Google-таблиц.\nНа данный момент я умею:\n\n/convert - Конвертировать файлы в гугл таблицу\n/delete - Удалять вашу почту для доступа из базы данных\n/email - Устанавливать новую почту для доступа к Google-таблицам\n\n Выберите действие:`,
					Markup.inlineKeyboard([
						Markup.button.callback('Конвертировать', 'convert'),
						Markup.button.callback('Изменить почту', 'email'),
						Markup.button.callback('Настройки', 'settings'),
					]))
			} )

			this.bot.action('restart', (ctx) => {
				this.email(ctx);
			});
				
		} catch (error) {
			throw new Error('Ошибка вызова команды email');
		}
	}
}