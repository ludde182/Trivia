var source = $("#quiz-template").html(); 
var template = Handlebars.compile(source); 

var app = {
	config: {
		url: 'https://opentdb.com/api.php?amount=1&difficulty=',
		difficulty: 'easy',
		generateURL: function() {
			return this.url + this.difficulty;
		},
	},

	gameInfo: {
		multipleChoice: '',
		question: '',
		correctAns: '',
		ansOptions: [],
	},

	apicall: function() {
		var url = this.config.generateURL();
		fetch(url)
			.then(function(response) {
				return response.json();
			}).then(function(response) {
				app.renderQuestion(response.results);
			});
	},

	renderQuestion: function(object) {
		this.gameInfo.multipleChoice = '';
		this.gameInfo.question = '';
		this.gameInfo.correctAns = '';
		this.gameInfo.ansOptions = [];


		if (object) {
			for (var i = 0; i < object.length; i++) {
				this.gameInfo.correctAns = object[i].correct_answer;
				this.gameInfo.question = object[i].question;
				if (object[i].type === 'multiple') {
					this.gameInfo.multipleChoice = true;
				} else {
					this.gameInfo.multipleChoice = false;
				}
				object[i].incorrect_answers.forEach(function(e) {
					app.gameInfo.ansOptions.push(e);
				});
				this.gameInfo.ansOptions.push(object[i].correct_answer);
				this.shuffle(this.gameInfo.ansOptions);
			}

			this.renderHTML();
		}
	},

	renderHTML: function() {
		$('#start-screen').html(template(this.gameInfo));
	},

	checkAns: function(answer) {
		var ansmsg = '';
		var corrAns = this.gameInfo.correctAns;
		if (answer.toLowerCase() === this.gameInfo.correctAns.toLowerCase()) {
			ansmsg = "<span class='correct-ans'> Correct! </span> It's "+ corrAns + '.';
			$('#answer').addClass('correct');
		}
		else {
			ansmsg = "<span class='wrong-ans'> Wrong! </span> It's " + corrAns + '!';
			$('#answer').addClass('wrong');
		}
		$('.answer').hide();
		$('#answer').html(ansmsg);	
	},

	shuffle: function(array) {
		var m = array.length, t, i;
	  	// While there remain elements to shuffle…
	  	while (m) {
	    // Pick a remaining element…
	    	i = Math.floor(Math.random() * m--);
	    // And swap it with the current element.
		    t = array[m];
		    array[m] = array[i];
		    array[i] = t;
	  	}
	  return array;
	}, 

	newQuestion: function() {

	}
}


/** HANDLEBARS LETTER FUNCTION **/
Handlebars.registerHelper('letterindex', function(value, options){
	return String.fromCharCode(65 + value);
});


/***** JQUERY ON CLICK HANDLERS *****/

$('#start-quiz').on('click', function(e) {
	e.preventDefault();
	app.apicall();
	$('.start-content').hide();
});

$('body').on('click','.answer', function() {
	var answer;
	if (app.gameInfo.multipleChoice) {
		answer = $(this).text().substr(3);
	}
	else {
		answer = $(this).text();
	}
	app.checkAns(answer);
});

$('body').on('click', '#new-question', function() {
	app.apicall();
});

$('body').on('click', '.changelvl', function() {
	var difficulty = $(this).attr('id');
	if (difficulty === 'easy') {
		if (app.config.difficulty === 'easy') {
			app.config.difficulty = 'medium';
		}
		else if (app.config.difficulty === 'medium') {
			app.config.difficulty = 'hard';
		} else {
			app.config.difficulty = 'hard';
		}
	} else if (difficulty === 'hard') {
		if (app.config.difficulty === 'hard') {
			app.config.difficulty = 'medium';
		}
		else if (app.config.difficulty === 'medium') {
			app.config.difficulty = 'easy';
		} else {
			app.config.difficulty = 'easy';
		}
	}
	app.apicall();
});
