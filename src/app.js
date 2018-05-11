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
		calendarContainer: 			document.getElementById( 'calendar-container' ),
		prevMonthButton: 				document.getElementById( 'prev-month-button' ),
		nextMonthButton: 				document.getElementById( 'next-month-button' ),
		todayButton: 						document.getElementById( 'today-button' ),
		currentDateLabel: 			document.getElementById( 'current-date-label' ),
		addEventButton: 				document.getElementById( 'add-event-button' ),
		updateButton: 					document.getElementById( 'update-button' ),
		searchInput: 						document.getElementById( 'search-input' ),
		clearSearchInput: 			document.getElementById( 'clear-header-input' ),
		addFastEventPopup:			document.getElementById( 'add-fast-popup' ),
		addFastEventError:			document.getElementById( 'add-fast-event-error' ),
		addEventPopup:					document.getElementById( 'add-event-popup' ),
		addEventPopupContainer:	document.getElementById( 'event-container' ),
		searchEventPopup:				document.getElementById( 'search-event-popup' ),
		addFastForm:			  		document.getElementById( 'add-fast-form' ),
		addFastInput:			  		document.getElementById( 'add-fast-input' ),
		searchContainer:				document.getElementById( 'search-container' )
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

		week.forEach( ( day, dayNumber) => { app.generateDay( _weekElem, day, index, dayNumber ) });

	},


	generateDay: ( weekElem, day, index, dayNumber ) => {

		let _dayElem = document.createElement( 'a' ),
				_label = document.createElement( 'span' ),
				_eventName = document.createElement( 'span' ),
				_description = document.createElement( 'span' ),
				_customers = document.createElement( 'span' );


		_dayElem.classList.add( 'calendar__day' );

		if ( dayNumber > 3 )
			_dayElem.classList.add( 'calendar__day--second-half' );

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

		let _date;

		elem.addEventListener( 'click', event => {

			_date = elem.getAttribute( 'data-date' ).split( '-' );

			app.openEventPopup( { date: _date[0], month: _date[1], year: _date[2] }, elem );


		});

	},

	openEventPopup: ( date, element ) => {

		let _container;

		_container = app.elements.addEventPopupContainer;
		_container.innerHTML = '';

		if ( element.classList.contains( 'calendar__day--active' ) ) {
			app.fillEditPopup( date, _container );
		} else {
			app.fillAddPopup( date, _container, {} );
		}

		if ( element.classList.contains( 'calendar__day--second-half' ) ) {
			app.elements.addEventPopup.style.top  = element.getBoundingClientRect( ).top  + window.scrollY + 'px';
			app.elements.addEventPopup.style.left = element.getBoundingClientRect( ).left + window.scrollX - app.elements.addEventPopup.getBoundingClientRect( ).width - 14 + 'px';
		} else {
			app.elements.addEventPopup.style.top  = element.getBoundingClientRect( ).top  + window.scrollY + 'px';
			app.elements.addEventPopup.style.left = element.getBoundingClientRect( ).left + window.scrollX + element.getBoundingClientRect( ).width + 14 + 'px';
		}

		app.elements.addEventPopup.classList.add( 'visible' );

		element.classList.add( 'calendar__day--selected' );

	},

	fillEditPopup: ( date, container ) => {

		let _event, _block, _divTitle, _divDate, _labelCustomers, _divCustomers, _labelDescription, _divDescription, _buttonEdit;

		app.datetime.events.forEach( evt => {
			if ( evt.date == date.date && evt.month == date.month && evt.year == date.year ) _event = evt;
		});


		// <---- 		Block 1   	---->

		_block = document.createElement( 'div' );
		_block.classList.add( 'event__block' );

		_divTitle = document.createElement( 'div' );
		_divTitle.classList.add( 'event__title' );
		_divTitle.innerHTML = _event.name;

		_divDate = document.createElement( 'div' );
		_divDate.classList.add( 'event__date' );
		_divDate.innerHTML = _event.date + ' ' + _event.monthAlias.toLowerCase( );

		_labelCustomers = document.createElement( 'div' );
		_labelCustomers.classList.add( 'event__label' );
		_labelCustomers.innerHTML = 'Участники:';

		_divCustomers = document.createElement( 'div' );
		_divCustomers.classList.add( 'event__customers' );
		_divCustomers.innerHTML = _event.customers;

		_block.append( _divTitle );
		_block.append( _divDate );
		_block.append( _labelCustomers );
		_block.append( _divCustomers );
		container.append( _block );

		// <---- 		Block 2   	---->

		_block = document.createElement( 'div' );
		_block.classList.add( 'event__block' );

		_labelDescription = document.createElement( 'div' );
		_labelDescription.classList.add( 'event__label' );
		_labelDescription.innerHTML = 'Описание:';

		_divDescription = document.createElement( 'div' );
		_divDescription.classList.add( 'event__description' );
		_divDescription.innerHTML = _event.description;

		_block.append( _labelDescription );
		_block.append( _divDescription );
		container.append( _block );

		// <---- 		Block 3   	---->
		
		_block = document.createElement( 'div' );
		_block.classList.add( 'event__block' );

		_buttonEdit = document.createElement( 'button' );
		_buttonEdit.classList.add( 'event__edit-button', 'default-button' );
		_buttonEdit.innerHTML = 'Редактировать';

		_block.append( _buttonEdit );
		container.append( _block );


		_buttonEdit.addEventListener( 'click', evt => {
			container.innerHTML = '';
			app.fillAddPopup( date, container, _event );
		});

	},

	fillAddPopup: ( date, container, event ) => {


		let _event, _block, _inputTitle, _inputCustomers, _inputDescription, _buttonAdd, _buttonDelete, form;

		form = document.createElement( 'form' );

		// <---- 		Block 1   	---->

		_block = document.createElement( 'div' );
		_block.classList.add( 'event__block' );

		_inputTitle = document.createElement( 'input' );
		_inputTitle.setAttribute( 'name', 'name' );
		_inputTitle.setAttribute( 'placeholder', 'Событие' );
		_inputTitle.required = true;
		_inputTitle.classList.add( 'event__name-input', 'default-input' );
		if ( event.name ) _inputTitle.value = event.name;

		_inputCustomers = document.createElement( 'input' );
		_inputCustomers.setAttribute( 'name', 'customers' );
		_inputCustomers.setAttribute( 'placeholder', 'Имена участников' );
		_inputCustomers.classList.add( 'event__customers-input', 'default-input' );
		if ( event.customers ) _inputCustomers.value = event.customers;

		_block.append( _inputTitle );
		_block.append( _inputCustomers );
		form.append( _block );

		// <---- 		Block 2   	---->

		_block = document.createElement( 'div' );
		_block.classList.add( 'event__block' );

		_inputDescription = document.createElement( 'textarea' );
		_inputDescription.setAttribute( 'name', 'description' );
		_inputDescription.setAttribute( 'placeholder', 'Описание' );
		_inputDescription.classList.add( 'event__description-textarea', 'default-input' );
		if ( event.description ) _inputDescription.innerHTML = event.description;

		_block.append( _inputDescription );
		form.append( _block );

		// <---- 		Block 3   	---->
		
		_block = document.createElement( 'div' );
		_block.classList.add( 'event__block' );

		_buttonAdd = document.createElement( 'button' );
		_buttonAdd.setAttribute( 'type', 'submit' );
		_buttonAdd.classList.add( 'event__add-button', 'default-button' );
		_buttonAdd.innerHTML = 'Готово';

		_buttonDelete = document.createElement( 'button' );
		_buttonDelete.setAttribute( 'type', 'button' );
		_buttonDelete.classList.add( 'event__delete-button', 'default-button' );
		_buttonDelete.innerHTML = 'Удалить';

		_block.append( _buttonAdd );
		_block.append( _buttonDelete );
		form.append( _block );

		container.append( form );

		app.submitAddEventHandler( form, date );
		app.deleteEventHandler( _buttonDelete, date );

	},

	deleteEventHandler: ( button, date ) => {

		button.addEventListener( 'click', evt => {
			app.datetime.events.forEach( ( _evt, index ) => {
				if ( _evt.date == date.date && _evt.month == date.month && _evt.year == date.year ) {
					app.datetime.events.splice( index, 1 );
				}
			});
			app.hideAddEventPopup( );
			app.datetime.updateParameters( );
			app.generateInterface( );
		});


	},

	submitAddEventHandler: ( form, date ) => {

		let _fields, _event, i, isEdit = false;

		form.addEventListener( 'submit', evt => {
			isEdit = false;
			evt.preventDefault( );
			
			_event = {
				date: date.date,
				year: date.year,
				month: date.month,
				monthAlias: app.datetime.monthsAliases[date.month][1],
				customers: '',
				name: '',
				description: ''
			};


			_fields = form.getElementsByClassName( 'default-input' );

			for ( i = 0; i < _fields.length; ++i ) { _event[_fields[i].getAttribute( 'name' )] = _fields[i].value; }

			app.datetime.events.forEach( ( _evt, index ) => {
				if ( _evt.date == _event.date && _evt.month == _event.month && _evt.year == _event.year ) {
					app.datetime.events[index] = _event;
					isEdit = true;
				}
			});

			if ( !isEdit ) app.datetime.events.push( _event );

			app.hideAddEventPopup( );
			app.datetime.updateParameters( );
			app.generateInterface( );

			return false;
		});

	},

	isCurrentDay: ( day ) => {
		let _currentDay = new Date( );
		return day.date == _currentDay.getDate( ) && day.month == _currentDay.getMonth( ) && day.year == _currentDay.getFullYear( );
	},


	generateInterface: ( ) => {
		
		app.generateCalendar( );

	},

	generateSearchPopupEventElement: ( searchContainer, event ) => {

		let _aContainer,
				_spanMainTitle,
				_spanDate,
				_hr;

		_aContainer = document.createElement( 'a' );
		_aContainer.classList.add( 'search__event' );
		_aContainer.setAttribute( 'data-date', event.date + '-' + event.month + '-' + event.year );

		_spanMainTitle = document.createElement( 'span' );
		_spanMainTitle.classList.add( 'search__title' );
		_spanMainTitle.innerHTML = event.name;
		
		_spanDate = document.createElement( 'span' );
		_spanDate.classList.add( 'search__date' );
		_spanDate.innerHTML = event.date + ' ' + event.monthAlias.toLowerCase( );

		if ( searchContainer.innerHTML != '' ) {
			_hr = document.createElement( 'div' );
			_hr.classList.add( 'search__separator' );
			searchContainer.append( _hr );
		}

		_aContainer.append( _spanMainTitle );
		_aContainer.append( _spanDate );
		searchContainer.append( _aContainer );

		app.searchElementHandler( _aContainer );

	},

	generateSearchPopupNoEvents: ( searchContainer ) => {

		let _noEventDiv;

		_noEventDiv = document.createElement( 'div' );
		_noEventDiv.classList.add( 'search__empty' );
		_noEventDiv.innerHTML = "По вашему запросу<br />ничего не найдено";

		searchContainer.append( _noEventDiv );
	},

	generateSearchPopupEventsList: ( ) => {

		let _searchValue, _searchContainer, hasEvents = false;;

		_searchContainer = app.elements.searchContainer;

		_searchContainer.innerHTML = '';
		_searchValue = app.elements.searchInput.value.toLowerCase( ).trim( );
		
		app.datetime.events.forEach( event => {

			if ( 
					_searchValue == '' || 
					event.date.toString( ).indexOf( _searchValue ) > -1 || 
					event.year.toString( ).indexOf( _searchValue ) > -1 || 
					event.monthAlias.toLowerCase( ).indexOf( _searchValue ) > -1 || 
					event.name.toLowerCase( ).indexOf( _searchValue ) > -1 || 
					event.description.toLowerCase( ).indexOf( _searchValue ) > -1 || 
					event.customers.toLowerCase( ).indexOf( _searchValue ) > -1 ) {
				hasEvents = true;
				app.generateSearchPopupEventElement( _searchContainer, event );
			} 

		});

		if ( !hasEvents ) app.generateSearchPopupNoEvents( _searchContainer );

	},

	appendHandlers: ( ) => {

		app.addEventButtonHandler( );
		app.updateButtonHandler( );
		app.addPrevButtonHandler( );
		app.addNextButtonHandler( );
		app.todayButtonHandler( );
		app.searchInputHandler( );
		app.clearSearchInputHandler( );
		app.submitFastEventForm( );

		app.documentClickHandler( );
		
		app.closePopupHandler( );

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

	addEventButtonHandler: ( ) => {

		let _button;

		app.elements.addEventButton.addEventListener( 'click', event => {
			_button = event.target;
			
			if ( _button.classList.contains( 'active' ) ) return;

			_button.classList.add( 'active' );

			app.elements.addFastInput.value = '';

			app.elements.addFastEventPopup.style.top  = _button.getBoundingClientRect( ).top  + window.scrollY + _button.getBoundingClientRect( ).height + 15 + 'px';
			app.elements.addFastEventPopup.style.left = _button.getBoundingClientRect( ).left + window.scrollX + 'px';
			app.elements.addFastEventPopup.classList.add( 'visible' );
		});
	},

	searchInputHandler: ( ) => {

		let _input, _popupVisible = false;

		[ 'focus', 'input' ].forEach( evt => {

			app.elements.searchInput.addEventListener( evt, event => {
				_input = event.target;
				_popupVisible = app.elements.searchEventPopup.classList.contains( 'visible' );

				if ( !_popupVisible ) {
					app.elements.searchEventPopup.classList.add( 'visible' );

					app.elements.searchEventPopup.style.top  = _input.getBoundingClientRect( ).top  + window.scrollY + _input.getBoundingClientRect( ).height + 15 + 'px';
					app.elements.searchEventPopup.style.left = _input.getBoundingClientRect( ).left + window.scrollX - 11 + 'px';
				}

				app.generateSearchPopupEventsList( );

			});

		});
	},

	clearSearchInputHandler: ( ) => {

		app.elements.clearSearchInput.addEventListener( 'click', evt => {
			app.elements.searchInput.value = '';
			app.hideSearchPopup( );
		});
	},

	closePopupHandler: ( ) => {

		let _closeButtons = document.getElementsByClassName( 'close-popup' );
		let _closeButton;

		for ( let i = 0; i < _closeButtons.length; ++i ) {
			_closeButton = _closeButtons[i];
			_closeButton.addEventListener( 'click', event => { 
				event.target.parentNode.classList.remove( 'visible' ); 
				app.elements.addEventButton.classList.remove( 'active' );
			});
		}
	},

	documentClickHandler: ( ) => {

		let _clickedElement, _activeElements, i, _clickedOnDayPopup = false;

		document.addEventListener( 'click', event => {

			_clickedElement = event.target;

			// If search popup visible
			if ( app.elements.searchEventPopup.classList.contains( 'visible' ) ) {
				if ( 
						_clickedElement != app.elements.searchEventPopup && 
						!_clickedElement.closest( '#' + app.elements.searchEventPopup.id ) && 
						_clickedElement != app.elements.searchInput 
					) 
					app.hideSearchPopup( );
			}

			_clickedOnDayPopup = ( _clickedElement == app.elements.addEventPopup ) || ( !!_clickedElement.closest( '#' + app.elements.addEventPopup.id ) );

			// console.log( _clickedElement, _clickedOnDayPopup, _clickedElement.closest( '#' + app.elements.addEventPopup.id ) );

			// If day popup visible
			if ( app.elements.addEventPopup.classList.contains( 'visible' ) ) {
				if ( 
						!_clickedElement.classList.contains( 'calendar__day' ) && 
						!_clickedElement.parentNode.classList.contains( 'calendar__day' ) && 
						!_clickedOnDayPopup &&
						!_clickedElement.classList.contains( 'event__edit-button' )
					) 
					app.hideAddEventPopup( );
			}


			_activeElements = document.getElementsByClassName( 'calendar__day--selected' );
			if ( _activeElements.length ) {
				for ( i = 0; i < _activeElements.length; ++i ) {
					if ( 
						(!_clickedOnDayPopup || _clickedElement.classList.contains( 'close-popup' ) ) &&
						_activeElements[i] != _clickedElement &&
						!_clickedElement.classList.contains( 'event__edit-button' ) &&
						_activeElements[i] != _clickedElement.parentNode ) 
						_activeElements[i].classList.remove( 'calendar__day--selected' );
				}
			}

		});
	},

	submitFastEventForm: ( ) => {

		let _value = '', _data, _event, _month, _lastDayOfMonth, _eventExist = false;

		app.elements.addFastForm.addEventListener( 'submit', evt => {

			evt.preventDefault( );

			_event = {
				date: 1,
				month: 0,
				monthAlias: '',
				year: app.datetime.selectedDate.year,
				name: '',
				description: '',
				customers: ''
			};

			_month = '';
			_lastDayOfMonth = 0;
			_eventExist = false;

			app.elements.addFastEventError.innerHTML = '';
			_value = app.elements.addFastInput.value.trim( ).toLowerCase( );

			if ( /^[0-9]{1,2}\s+[а-яё]+\s*\,\s*([ёа-я0-9a-z\,\.\-\—\(\)\+]+\s*)+$/.test( _value ) == false ) {
				app.elements.addFastEventError.innerHTML = 'Ошибка данных! Введите данные в правильном формате:<br /> <День> <Месяц>, <Событие>';
				return false;
			} 

			_data = _value.split( ',' );

			// Date
			_data[0] = _data[0].trim( );
			// Event name
			_data[1] = _data[1].trim( );

			_event.name = _data[1];


			_data[0] = _data[0].split( ' ' );

			// Date date
			_data[0][0] = +_data[0][0].trim( );

			if ( _data[0][0] == 0 ) {
				app.elements.addFastEventError.innerHTML = 'Ошибка данных! День не может принимать значение "0"';
				return false;
			}

			// Date month
			_data[0][1] = _data[0][1].trim( );

			// Searching month
			app.datetime.monthsAliases.forEach( ( month, index ) => {
				if ( month[0].toLowerCase( ) == _data[0][1] ||  month[1].toLowerCase( ) == _data[0][1] ) {
					_month = month[1];
					_event.month = index;
					_event.monthAlias = month[1];
				}
			});

			if ( _month == '' ) {
				app.elements.addFastEventError.innerHTML = 'Ошибка данных! Введённый месяц не найден';
				return false;
			}

			_lastDayOfMonth = new Date( _event.year, ( _event.month + 1 ), 0 ).getDate( );

			if ( _data[0][0] > _lastDayOfMonth ) {
				app.elements.addFastEventError.innerHTML = 'Ошибка данных! В выбранном месяце всего ' + _lastDayOfMonth + ' дней';
				return false;
			}

			_event.date = _data[0][0];

			app.datetime.events.forEach( _evt => {
				if ( _evt.date == _event.date && _evt.month == _event.month && _evt.year == _event.year ) _eventExist = true;
			});

			if ( _eventExist ) {
				app.elements.addFastEventError.innerHTML = 'Ошибка данных! Выбранная дата уже содержит событие';
				return false;
			}

			app.datetime.events.push( _event );
			app.hideAddFastEventPopup( );
			app.datetime.updateParameters( );
			app.updateInterface( );

 

			return false;
		});

	},

	hideSearchPopup: ( ) => {
		app.elements.searchEventPopup.classList.remove( 'visible' );
	},

	hideAddFastEventPopup: ( ) => {
		app.elements.addEventButton.classList.remove( 'active' );
		app.elements.addFastEventPopup.classList.remove( 'visible' );
	},

	hideAddEventPopup: ( ) => {
		app.elements.addEventPopup.classList.remove( 'visible' );
	},

	searchElementHandler: ( element ) => {

		let _eventDate;

		element.addEventListener( 'click', event => {
			_eventDate = element.getAttribute( 'data-date' ).split( '-' );
			app.datetime._obj_selectedDate = new Date( _eventDate[2], _eventDate[1], _eventDate[0] );
			app.hideSearchPopup( );
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

