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
		[ 'Январь',   'Января'	 ],
		[ 'Февраль',  'Февраля'	 ],
		[ 'Март',     'Марта'		 ],
		[ 'Апрель',   'Апреля'	 ],
		[ 'Май',			'Мая' 		 ],
		[ 'Июнь',		  'Июня'		 ],
		[ 'Июль',		  'Июля'		 ],
		[ 'Август',	  'Августа'  ],
		[ 'Сентябрь', 'Сентября' ],
		[ 'Октябрь',  'Октября'  ],
		[ 'Ноябрь',	  'Ноября'	 ],
		[ 'Декабрь',	'Декабря'	 ]
	],

	_obj_selectedDate: new Date( ),
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

	events: [
		{
			date: 9,
			month: 4,
			monthAlias: 'Мая',
			year: 2018,
			name: 'День Победы!',
			description: 'Надо отпраздновать!',
			customers: 'Александр Петров, Иван Дашкевич'
		},
		{
			date: 22,
			month: 5,
			monthAlias: 'Июня',
			year: 2018,
			name: 'День Рождения',
			description: 'ДР у Георгия Константиновича',
			customers: 'Валерий Марков, Юрий Игнатьев'
		}
	],


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

		datetime.setLocalStorage( );
	},


	getSelectedDateDefaultParameters: ( ) => { datetime.getDateDefaultParameters( datetime.selectedDate, datetime._obj_selectedDate ) },
	getPrevDateDefaultParameters: 		( ) => { datetime.getDateDefaultParameters( datetime.prevDate, datetime._obj_prevDate ) },
	getNextDateDefaultParameters: 		( ) => { datetime.getDateDefaultParameters( datetime.nextDate, datetime._obj_nextDate ) },

	getDateDefaultParameters: ( paramObject, dateObject ) => {
		paramObject.year 				= dateObject.getFullYear( );
		paramObject.month 			= dateObject.getMonth( );
		paramObject.monthAlias 	= datetime.monthsAliases[paramObject.month][0];
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

		let _week = [],
				_needToAddBefore = 0,
				_needToAddAfter = 0,
				_currentWeek = 0,
				_currentDate = 1,
				_dayObject = { },
				i;


		datetime.calendarData = [];

		// If we start not on monday in this month, 
		// need to take a days from previous month
		if ( datetime.firstDayOfMonth !== 1 ) {
			if ( datetime.firstDayOfMonth === 0 )
				_needToAddBefore = 6;
			else
				_needToAddBefore = datetime.firstDayOfMonth - 1;
		}

		// If we end not on sunday in this month, 
		// need to take a days from next month
		if ( datetime.lastDayOfMonth !== 0 ) {
			_needToAddAfter = 7 - datetime.lastDayOfMonth;
		}		


		// Adding weeks

		// Days from previous month
		for ( i = _needToAddBefore; i > 0; --i ) {
			_dayObject = {
				year: datetime.prevDate.year, 
				month: datetime.prevDate.month,
				date: ( datetime.prevDate.date - i + 1 ),
				day: ( ( _needToAddBefore - i ) == 0 ) ? 0 : ( _needToAddBefore - i ),
				dayAlias: '',
				event: {}
			}
			_dayObject.dayAlias = datetime.daysOfWeek[_dayObject.day];

			datetime.events.forEach( event => {
				if ( event.date == _dayObject.date && event.month == _dayObject.month && event.year == _dayObject.year ) _dayObject.event = event;
			});

			_week.push( _dayObject );
		}




		// Days from current month
		i = 1;
		while ( i < datetime.countOfDays + 1 ) {

			_dayObject = {
				year: datetime.selectedDate.year, 
				month: datetime.selectedDate.month,
				date: i,
				day: _week.length,
				dayAlias: '',
				event: {}
			}
			_dayObject.dayAlias = datetime.daysOfWeek[_dayObject.day];

			datetime.events.forEach( event => {
				if ( event.date == _dayObject.date && event.month == _dayObject.month && event.year == _dayObject.year ) _dayObject.event = event;
			});

			_week.push( _dayObject );

			if ( _week.length > 6 ) {
				datetime.calendarData.push( _week );
				_week = [];
			}

			++i;
		}




		// Days from next month
		for ( i = 0; i < _needToAddAfter; ++i ) {
			_dayObject = {
				year: datetime.nextDate.year, 
				month: datetime.nextDate.month,
				date: ( datetime.nextDate.date + i ),
				day: ( ( 7 - _needToAddAfter + i ) == 0 ) ? 6 : ( 7 - _needToAddAfter + i ),
				dayAlias: '',
				event: {}
			}
			_dayObject.dayAlias = datetime.daysOfWeek[_dayObject.day];

			datetime.events.forEach( event => {
				if ( event.date == _dayObject.date && event.month == _dayObject.month && event.year == _dayObject.year ) _dayObject.event = event;
			});

			_week.push( _dayObject );
		}

		if ( _week.length > 6 ) {
			datetime.calendarData.push( _week );
		}


	},

	setLocalStorage: ( ) => {

		let _localStorageObject = {
			events: datetime.events,
			selectedDate: datetime.selectedDate
		};

		window.localStorage.setItem( 'data', JSON.stringify( _localStorageObject ) );
	},

	getLocalStorage: ( ) => {
		let _lsData;
		_lsData = window.localStorage.getItem( 'data' );
		if ( _lsData ) {
			_lsData = JSON.parse( _lsData );
			datetime.events = _lsData.events;
			datetime._obj_selectedDate = new Date( _lsData.selectedDate.year, _lsData.selectedDate.month, _lsData.selectedDate.date );
		}
		
		datetime.updateParameters( );
	}


};




// Get default date parameters
datetime.getLocalStorage( );

export { datetime };