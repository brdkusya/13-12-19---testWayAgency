'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

// Попап окно
var isStorageSupport = true;
var storage = localStorage.getItem('name');

try {
	storage = localStorage.getItem('name'); 
}
catch (err) {
	isStorageSupport = false;
}

var popup = document.querySelector('.request');
var popupOpen = document.querySelector('.top-line__call');
var popupClose = document.querySelector('.request__close');
var form = popup.querySelector('form');
var name = popup.querySelector('[name=modal-name]');
var number = popup.querySelector('[name=modal-phone]');

var openPopup = function() {
	popup.classList.add('request--show');

	if (storage) {
		name.value = storage;
		number.focus();
	}
	else {
		name.focus();
	};

	document.addEventListener('keydown', onPopupEscPress);
};

var closePopup = function() {
	popup.classList.remove('request--show');
	popup.classList.remove('request-error');
	document.removeEventListener('keydown', onPopupEscPress);
};

var onPopupEscPress = function(evt) {
	if (evt.keyCode === ESC_KEYCODE) {
		closePopup();
	}
};

popupOpen.addEventListener('click', function (evt) {
	evt.preventDefault();
	openPopup();
});

popupOpen.addEventListener('keydown', function (evt) {
	if (evt.keyCode === ENTER_KEYCODE) {
		openPopup();
	}
})

popupClose.addEventListener('click', function (evt) {
	evt.preventDefault();
	closePopup();
});

popupClose.addEventListener('keydown', function (evt) {
	if(evt.keyCode === ENTER_KEYCODE){
		closePopup();
	}
});

form.addEventListener('submit', function (evt) {
	if (!name.value || !number.value) {
		evt.preventDefault();
		popup.classList.add('request--error');
	}
	else {
		if (isStorageSupport) {
			localStorage.setItem('name', name.value);
		}
	}
});

//
//
//
//
// Полоса завершенности у квиза
var testLine = document.querySelector('.test__line');
var testIndicator = testLine.querySelector('.test__indicator');
var questionNow = testLine.querySelector('.test__now');
var questionAll = testLine.querySelector('.test__all');

// Считаем количество вопросов, записываем в полосу
var allQuestions = document.querySelectorAll('.test__item');
var k = allQuestions.length;
questionAll.textContent = k;

// Прячем все вопросы кроме первого
for (var i = 1; i < allQuestions.length; i++) {
	allQuestions[i].classList.add('visually-hidden');
};

// Определяем текущий вопрос, записываем в полосу (возвращает позицию текущего вопроса)
var getQuestion = function() {
	var nowQ = 0;
	for (var i = 0; i < allQuestions.length && nowQ==0; i++) {
		if (allQuestions[i].classList.contains('test__item--active'))
			nowQ = i+1;
	};
	return nowQ;
};

// Записываем номер текущего вопроса в полосу
var writeQuestion = function() {
	var now = getQuestion();
	questionNow.textContent = now;
};

// Двигаем индикатор
var moveIndicator = function() {
	var now;
	now = getQuestion();
	testIndicator.style.width = now*100/k + '%';
};

moveIndicator();

//
//
//
//
// Кнопки навигации квиза
var quizNav = document.querySelector('.quiz__nav');
var prevButton = quizNav.querySelector('.quiz__prev');
var nextButton = quizNav.querySelector('.quiz__next');
var completeButton = quizNav.querySelector('.quiz__complete');
var quizForm = document.querySelector('.test__call');

// Если в списке только один вопрос
if (k == 1) {
	nextButton.style.display = 'none';
	completeButton.style.display = 'inline-block';
};
 
nextButton.addEventListener('click', function() {
	var actualQuestion = getQuestion();

	allQuestions[actualQuestion-1].classList.remove('test__item--active');
	allQuestions[actualQuestion-1].classList.add('visually-hidden');
	allQuestions[actualQuestion].classList.add('test__item--active');
	allQuestions[actualQuestion].classList.remove('visually-hidden');

	writeQuestion();
	moveIndicator();
	// Если мы на первом вопросе и хотим двигаться вперед
	if (actualQuestion == 1) {
		prevButton.style.display = 'inline-block';
	};
	// Если мы на предпоследнем вопросе и хотим двигаться вперед
	if (actualQuestion == k-1) {
		nextButton.style.display = 'none';
		completeButton.style.display = 'inline-block';
	};
});

prevButton.addEventListener('click', function() {
	var actualQuestion = getQuestion();

	allQuestions[actualQuestion-1].classList.remove('test__item--active');
	allQuestions[actualQuestion-1].classList.add('visually-hidden');
	allQuestions[actualQuestion-2].classList.add('test__item--active');
	allQuestions[actualQuestion-2].classList.remove('visually-hidden');
	
	writeQuestion();
	moveIndicator();
	// Если мы на втором вопросе и хотим двигаться назад
	if (actualQuestion == 2) {
		prevButton.style.display = 'none';
	};
	// Если мы на последнем вопросе и хотим двигаться назад
	if (actualQuestion == k) {
		nextButton.style.display = 'inline-block';
		completeButton.style.display = 'none';
	};
});

completeButton.addEventListener('click', function() {
	var questionList = document.querySelector('.test__list');
	questionList.style.display = 'none';
	quizForm.style.display = 'block';
	prevButton.style.display = 'none';
	completeButton.style.display = 'none';
});

//
//
//
//
// Видео карусель
var carusel = document.querySelector('.reviews__list');
var caruselNav = document.querySelectorAll('.navigation__item');
var caruselList = document.querySelectorAll('.reviews__item');
var navigation = document.querySelector('.navigation');

// Ищем активную видеозапись
var findActive = function() {
	var activeItem = -1;
	for (var i = 0; i < caruselList.length && activeItem == -1; i++) {
		if (caruselList[i].classList.contains('reviews__item--active'))
			activeItem = i;
	};
	console.log('Нашел активный элемент:', activeItem);
	return activeItem;
};

// // Сдвигаем карусель к нужному видео
// var moveCarusel = function() {
// 	var active = findActive();
// 	var j = document.documentElement.clientWidth/2 - (903/2) - (924*active);
// 	console.log(j);
// 	// Сдвигаем
// 	carusel.style.left = ''+ j +'px';
// };

// // Отслеживаем событие на клик по навигации и двигаем карусель
// navigation.addEventListener('click', function(e) {
	
// 	if (e.target.className == 'navigation__item') {
// 		var active = findActive();
// 		caruselList[active].classList.remove('reviews__item--active');
// 		caruselNav[active].classList.remove('navigation__item--active');
// 		caruselList[e.target.textContent-1].classList.add('reviews__item--active');
// 		caruselNav[e.target.textContent-1].classList.add('navigation__item--active');

// 		moveCarusel();
// 	}
// });

//
//
//
//
// Кнопка play для видео 
carusel.addEventListener('click', function(e) {
	var playButton = e.target;
	if (playButton.className == 'reviews__play') {
		var videoWrapper = playButton.parentNode; // Узнаем родительский элемент кнопки
		var videoElement = videoWrapper.querySelector('video'); // Находим соответствующее кнопке видео
		videoElement.play();
		videoElement.setAttribute('controls','');
		playButton.style.display = 'none'; // После запуска видео, убираем кнопку
	}

});