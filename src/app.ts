import { ConfigService } from './config/config.service';
import 'reflect-metadata';
import { IConfigService } from './config/config.interface';
import { Context, Telegraf } from 'telegraf';
import { IBotContext } from './context/context.interface';
import { Command } from './commands/command.class';
import { StartCommand } from './commands/start.command';
import LocalSession from 'telegraf-session-local';
import { EmailCommand } from './commands/email.command';
import { ConvertCommand } from './commands/convert.command';
import { SettingsCommand } from './commands/settings.command';
import { LoggerService } from './logger/logger.service';
import { Logger } from 'tslog';

export class Bot {
	bot: Telegraf<IBotContext>;
	commands: Command[] = [];
	constructor(
		private readonly configService: IConfigService,
		private readonly loggerService: LoggerService
		) {
			this.bot = new Telegraf<IBotContext>(this.configService.get('TOKEN_BOT_CSV'));
			this.bot.use(
				new LocalSession({ database: 'sessions.json'})
				.middleware()
			);
			// this.loggerService = new LoggerService()
	}

	init() {
		this.commands = [
			new StartCommand(this.bot),
			new EmailCommand(this.bot),
			new ConvertCommand(this.bot),
			new SettingsCommand(this.bot),
		];
		for (const command of this.commands) {
			command.handle();
			this.loggerService.log(`Command is on handle ${command.constructor.name}`)
		}
		this.bot.launch();
		this.loggerService.log(`Bot started on ${this.configService.get('TEST_TOKEN')}`);
	}

	restartBot() {
		// Закрываем текущий экземпляр бота
		this.bot.stop();
		// Запускаем новый экземпляр бота
		const bot = new Bot(new ConfigService(), new LoggerService);
		bot.init();
	}
}

const bot = new Bot(new ConfigService(), new LoggerService);

bot.init();

bot.bot.catch((err: unknown, ctx: Context) => {
    console.error(`Error in bot: ${err}`);
    // Перезапуск бота
    bot.restartBot();
});