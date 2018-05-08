const datetime = {
	daysOfWeek: [
		'Понедельник',
		'Вторник',
		'Среда',
		'Четверг',
		'Пятница',
		'Суббота',
		'Воскресенье'
	],
	monthsAliases: [
		'Январь',
		'Февраль',
		'Март',
		'Апрель',
		'Май',
		'Июнь',
		'Июль',
		'Август',
		'Сентябрь',
		'Октябрь',
		'Ноябрь',
		'Декабрь'
	],
	_obj_selectedDate: new Date( 2018, 2, 1 ),
	_obj_prevDate: new Date( ),
	_obj_nextDate: new Date( ),

	selectedDate: {
		year: 1970, 
		month: 0,
		monthAlias: 'Январь',
		date: 1,
		day: 0
	},

	prevDate: {
		year: 1970, 
		month: 0,
		monthAlias: 'Январь',
		date: 1
	},

	nextDate: {
		year: 1970, 
		month: 0,
		monthAlias: 'Январь',
		date: 1
	},

	countOfDays: 30,
	firstDayOfMonth: 0,
	lastDayOfMonth: 0,

	calendarData: [],

	events: [],


	updateParameters: ( ) => {
		datetime.selectedDate.day = datetime._obj_selectedDate.getDay( );

		datetime._obj_prevDate = new Date( datetime._obj_selectedDate.getTime( ) );
		datetime._obj_nextDate = new Date( datetime._obj_selectedDate.getTime( ) );

		datetime._obj_prevDate.setDate( 0 );
		datetime._obj_nextDate.setDate( 1 );
		datetime._obj_nextDate.setMonth( datetime._obj_nextDate.getMonth( ) + 1 );

		datetime.getSelectedDateDefaultParameters( );
		datetime.getPrevDateDefaultParameters( );
		datetime.getNextDateDefaultParameters( );

		datetime.getCountsOfDays( );
		datetime.getFirstDayOfMonth( );
		datetime.generateCalendarData( );
	},


	getSelectedDateDefaultParameters: ( ) => { datetime.getDateDefaultParameters( datetime.selectedDate, datetime._obj_selectedDate ) },
	getPrevDateDefaultParameters: 		( ) => { datetime.getDateDefaultParameters( datetime.prevDate, datetime._obj_prevDate ) },
	getNextDateDefaultParameters: 		( ) => { datetime.getDateDefaultParameters( datetime.nextDate, datetime._obj_nextDate ) },

	getDateDefaultParameters: ( paramObject, dateObject ) => {
		paramObject.year 				= dateObject.getFullYear( );
		paramObject.month 			= dateObject.getMonth( );
		paramObject.monthAlias 	= datetime.monthsAliases[paramObject.month];
		paramObject.date 				= dateObject.getDate( );
	},

	getCountsOfDays: ( ) => {
		let _date = new Date( datetime._obj_nextDate );
		_date.setDate( 0 );
		datetime.countOfDays = _date.getDate( );

		// Also need to take a last day of month, 
		// will be usefull to check and add if needed 
		// additional days from next month to complete week
		datetime.lastDayOfMonth = _date.getDay( );
	},

	getFirstDayOfMonth: ( ) => {
		let _date = new Date( datetime._obj_selectedDate );
		_date.setDate( 1 );
		datetime.firstDayOfMonth = _date.getDay( );
	},

	generateCalendarData: ( ) => {

		let _week = [];
		datetime.calendarData = [];

		// If we start not on monday in this month, 
		// need to take a days from previous month
		if ( datetime.firstDayOfMonth !== 1 ) {
			if ( datetime.firstDayOfMonth === 0 )
				console.log( 'need to add: 6 day(s) in the start of week' );
			else
				console.log( 'need to add: ' + ( datetime.firstDayOfMonth - 1 ) + ' day(s) in the start of week' );
		}

		// Adding weeks



		// If we end not on sunday in this month, 
		// need to take a days from next month
		if ( datetime.lastDayOfMonth !== 0 ) {
			console.log( 'need to add: ' + ( 7 - datetime.lastDayOfMonth ) + ' day(s) in the end of week' );
		}		


	}

};






// Get default date parameters
datetime.updateParameters( );

export { datetime };