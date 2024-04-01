import * as fs from 'fs';
import { ICredentials } from './credentials.interface';
import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library';
import { CsvService } from '../csv/csv.service';

export class GoogleApiService {
	client: OAuth2Client = new OAuth2Client;
	spreadsheetId: string = '';
	spreadsheetUrl: string = '';
	csvService: CsvService;

	constructor() {
		this.csvService = new CsvService();
		const credentials: ICredentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf-8'));
		try {
			// Аутентификация с использованием учетных данных
			const auth = new google.auth.GoogleAuth({
				credentials: {
					client_email: credentials.client_email,
					private_key: credentials.private_key,
				},
				scopes: [
					'https://www.googleapis.com/auth/spreadsheets',
					'https://www.googleapis.com/auth/drive',
				],
			});
			//Вызов метода инициализации клиента
			this.initializeClient(auth);
		} catch (error) {
			console.error('Произошла ошибка:', error);
		}
	}
	//Метод инициализации клиента
	async initializeClient(auth: any): Promise<void> {
		try {
			this.client = await auth.getClient();
		} catch (error) {
			console.error('Произошла ошибка при инициализации клиента:', error);
		}
	}
	//Метод проверки нового запроса на запись в таблицу
	async handleNewRequest(fileName: string, mail: string, chatId: number, csvData: any[]): Promise<void> {
		await this.createTable(this.client, fileName, mail, chatId);
		// Импортировать CSV в Google Sheets
		await this.importCSVtoGoogleSheets(this.spreadsheetId, csvData);
		// Обновить URL пользователя в базе данных
	}

	//Метод создания таблицы
	async createTable(client: OAuth2Client, fileName: string, mail: string, chatId: number): Promise<void> {
		try {
			//создание гугл таблицы
		console.log(`Создание новой таблицы...`);
		// Создание клиента для доступа к API Google Sheets
		const sheets = google.sheets({ version: 'v4', auth: client });
		const currentData = new Date();
		const spreadTitle = `${currentData.toLocaleString()}`;
		const sheetTitle = `Sheet1`;
		// Запрос на создание новой таблицы
		const response = await sheets.spreadsheets.create({
			requestBody: {
				properties: {
					title: spreadTitle, // Укажите желаемое название таблицы
				},
				sheets: [
					{
						properties: {
							title: sheetTitle,
						},
					},
				],
			},
		});
		this.spreadsheetUrl = `\n${fileName}: ${response.data.spreadsheetUrl}`;
		// Получаем ID созданной таблицы
		const spreadsheetId = response.data.spreadsheetId;
		// Дать доступ к таблице
		const drive = google.drive({ version: 'v3', auth: this.client });
		await drive.permissions.create({
			fileId: spreadsheetId || undefined,
			requestBody: {
				role: 'writer',
				type: 'user',
				emailAddress: mail,
			},
		});
		console.log('Доступ к таблице успешно предоставлен.');
		this.spreadsheetId = spreadsheetId as string;
		} catch (error) {
			throw new Error('Ошибка создания таблицы')
		}
	}
	//импорт csv в таблицу
	async importCSVtoGoogleSheets(spreadsheetId: any, csvData: any[]): Promise<void> {
		try {
			const sheets = google.sheets({ version: 'v4', auth: this.client });
			if(Array.isArray(csvData) && csvData.length > 0) {
				const csvContent = JSON.parse(JSON.stringify(csvData));
				const response = await sheets.spreadsheets.values.append({
				spreadsheetId: spreadsheetId, // ID вашего Google Sheets документа
				range: 'Sheet1', // Лист и диапазон, куда вы хотите импортировать данные
				valueInputOption: 'RAW',
				requestBody: {
					values: csvContent.map((row: any) => Object.values(row)),
				},
			});

			console.log('Данные успешно импортированы в Google Sheets:', response.data);
			} else {
				console.log('CSV DATA NO ARRAY')
			}
			
		} catch (error) {
			console.error('Произошла ошибка:', error);
		}
	}
	
}