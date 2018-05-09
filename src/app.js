/* =============================== *\

		 Created by Andrew Paramonov

\* =============================== */



// Including styles
require( './scripts/style.js' );



// Getting custom datetime presets
import { datetime } from './scripts/datetime';

// Main Application
const app = {

	elements: {
		calendarContainer: 	document.getElementById( 'calendar-container' ),
		prevMonthButton: 		document.getElementById( 'prev-month-button' ),
		nextMonthButton: 		document.getElementById( 'next-month-button' ),
		todayButton: 				document.getElementById( 'today-button' ),
		currentDateLabel: 	document.getElementById( 'current-date-label' ),
		addEventButton: 		document.getElementById( 'add-event-button' ),
		updateButton: 			document.getElementById( 'update-button' ),
		searchInput: 				document.getElementById( 'search-input' ),
		clearSearchInput: 	document.getElementById( 'clear-header-input' )
	},
	
	datetime: datetime,

	
	generateCalendar: ( ) => {

		app.elements.currentDateLabel.innerHTML = app.datetime.selectedDate.monthAlias + ' ' + app.datetime.selectedDate.year;
		app.elements.calendarContainer.innerHTML = '';
		app.datetime.calendarData.forEach( ( week, index ) => { app.generateWeeks( week, index ) });

	},

	generateWeeks: ( week, index ) => {

		let _weekElem = document.createElement( 'div' );
		_weekElem.classList.add( 'calendar__week-row' );
		app.elements.calendarContainer.append( _weekElem );

		week.forEach( day => { app.generateDay( _weekElem, day, index ) });

	},


	generateDay: ( weekElem, day, index ) => {

		let _dayElem = document.createElement( 'a' ),
				_label = document.createElement( 'span' ),
				_eventName = document.createElement( 'span' ),
				_description = document.createElement( 'span' ),
				_customers = document.createElement( 'span' );


		_dayElem.classList.add( 'calendar__day' );
		
		if ( app.isCurrentDay( day ) ) 
			_dayElem.classList.add( 'calendar__day--current' );


		_label.classList.add( 'day__label' );
		if ( index === 0 ) 
			_label.innerHTML = day.date + ', ' + day.dayAlias;
		else
			_label.innerHTML = day.date;

		_dayElem.append( _label );
		
		if ( day.event.hasOwnProperty( 'name' ) ) {
			_dayElem.classList.add( 'calendar__day--active' );
			_eventName.innerHTML = day.event.name;
			_description.innerHTML = day.event.description;
			_customers.innerHTML = day.event.customers;
			_eventName.classList.add( 'day__event' );
			_description.classList.add( 'day__description' );
			_customers.classList.add( 'day__customers' );
			_dayElem.append( _eventName );
			_dayElem.append( _customers );
			_dayElem.append( _description );
		}

		_dayElem.setAttribute( 'data-date', day.date + '-' + day.month + '-' + day.year );

		app.onClickDayHandler( _dayElem );
		
		weekElem.append( _dayElem );

	},


	onClickDayHandler: ( elem ) => {


		elem.addEventListener( 'click', event => {
			console.log( elem.getAttribute( 'data-date' ) );
		});

	},


	isCurrentDay: ( day ) => {
		let _currentDay = new Date( );
		return day.date == _currentDay.getDate( ) && day.month == _currentDay.getMonth( ) && day.year == _currentDay.getFullYear( );
	},


	generateInterface: ( ) => {
		
		app.generateCalendar( );

	},


	appendHandlers: ( ) => {

		app.updateButtonHandler( );
		app.addPrevButtonHandler( );
		app.addNextButtonHandler( );
		app.todayButtonHandler( );

	},

	addPrevButtonHandler: ( ) => {

		app.elements.prevMonthButton.addEventListener( 'click', event => {
			app.datetime._obj_selectedDate.setMonth( app.datetime._obj_selectedDate.getMonth( ) - 1 );
			app.datetime.updateParameters( );
			app.updateInterface( );
		});

	},

	addNextButtonHandler: ( ) => {

		app.elements.nextMonthButton.addEventListener( 'click', event => {
			app.datetime._obj_selectedDate.setMonth( app.datetime._obj_selectedDate.getMonth( ) + 1 );
			app.datetime.updateParameters( );
			app.updateInterface( );
		});

	},

	updateButtonHandler: ( ) => {
		app.elements.updateButton.addEventListener( 'click', event => {
			// ???? I don't know what have to be here
		});
	},

	todayButtonHandler: ( ) => {
		app.elements.todayButton.addEventListener( 'click', event => {
			app.datetime._obj_selectedDate = new Date(  );
			app.datetime.updateParameters( );
			app.updateInterface( );
		});
	},

	updateInterface: ( ) => {
		app.generateInterface( );
	}

};


app.generateInterface( );
app.appendHandlers( );

