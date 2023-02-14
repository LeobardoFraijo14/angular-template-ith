export class UtilsService {
	static isNoE(data: any) {
		return data === null || typeof data === 'undefined' ||
			(typeof data === 'string' && data === '') ||
			(Array.isArray(data) && data.length === 0) ||
			(typeof data === 'object' && Object.keys(data).length === 0)
	}
	static matchArrays<T>(array1: T[], array2: T[]) {
		array1 = array1 || []
		array2 = array2 || []
		return array1.filter(element => array2.includes(element));
	}
}