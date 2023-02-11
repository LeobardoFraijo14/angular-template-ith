export class UtilsService {
	static isNoE(data: any) {
		return data === null || typeof data === 'undefined' || 
		(typeof data === 'string' && data === '') ||
		(Array.isArray(data) && data.length === 0) ||
		(typeof data === 'object' && Object.keys(data).length === 0)
	}
}