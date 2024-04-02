import { Telegraf } from 'telegraf';
import { Command } from './command.class';
import { IBotContext } from '../context/context.interface';
import { EmailCommand } from './email.command';

export class AuthCommand extends Command {
	emailCommand: EmailCommand;
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
		emailCommand: EmailCommand;
	}

	handle(): void {
		this.bot.action('auth_inline', (ctx: IBotContext) => {
			ctx.session.email = '';
			ctx.session.convert_to = '';
			ctx.session.convert_type = '';
			ctx.session.convert_settings = '';
			ctx.reply('Введите почту')
			this.bot.hears(/.*?/, async (ctx) => {
				this.emailCommand.email(ctx);
			})
		})
	}
}