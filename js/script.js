// apis
const apiProfession = "http://sandbox.gibm.ch/berufe.php";
const apiClass = "http://sandbox.gibm.ch/klassen.php";
const apiTable = "http://sandbox.gibm.ch/tafel.php";

// weekdays
const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// current week counter for calculation
let weekCounter = 0;

// get all Professions and fill "professions" dropdown
function getProfessions() {
    // notify user request is loading
    $('.professions h2').after('<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>');
    $.ajax({
        url: apiProfession,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            data.forEach(profession => {
                $('#professions').append('<option value="' + profession.beruf_id + '">' + profession.beruf_name + '</option>');
            });
            let savedProfession = localStorage.getItem('profession');
            if (savedProfession) {
                $('#professions').val(savedProfession);
            }
        },
        error: function (xhr, status, error) {
            alert('Error:', status, error);
        }
    });
    $('.professions .spinner-border').remove();
}

// get schoolClasses with profession parameter and fill "classes" dropdown
// if no profession parameter is present, get all schoolClasses
function getClasses(profession) {
    // notify user request is loading
    $('.classes h2').after('<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>');
    var params = {
        beruf_id: profession
    }
    $.ajax({
        url: apiClass,
        method: 'GET',
        dataType: 'json',
        data: params,
        success: function (data) {
            if (profession) {
                localStorage.setItem('profession', profession);
                $('#classes').empty();
            }
            data.forEach(schoolClass => {
                $('#classes').append('<option value="' + schoolClass.klasse_id + '">' + schoolClass.klasse_name + ', ' + schoolClass.klasse_longname + '</option>');
            });
            let savedSchoolClass = localStorage.getItem('schoolClass');
            if (savedSchoolClass) {
                $('#classes').val(savedSchoolClass);
            }
        },
        error: function (xhr, status, error) {
            alert('Error:', status, error);
        }
    });
    $('.classes .spinner-border').remove();
}

// get table for schoolClass with week and fill table
// if no week is present, take current week
function getTable(schoolClass, week = getCurrentWeekNumber()) {
    if (!schoolClass) {
        return
    }
    // notify user request is loading
    $('.table h2').after('<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>');
    var params = {
        klasse_id: schoolClass,
        woche: week
    }
    $.ajax({
        url: apiTable,
        method: 'GET',
        dataType: 'json',
        data: params,
        success: function (data) {
            localStorage.setItem('schoolClass', schoolClass);
            $('#table').empty();
            data.forEach(table => {
                $('#table').append('<tr>' +
                    '<td>' + table.tafel_datum + '</td>' +
                    '<td>' + weekday[table.tafel_wochentag] + '</td>' +
                    '<td>' + table.tafel_von.slice(0, -3) + '</td>' +
                    '<td>' + table.tafel_bis.slice(0, -3) + '</td>' +
                    '<td>' + table.tafel_lehrer + '</td>' +
                    '<td>' + table.tafel_longfach + '</td>' +
                    '<td>' + table.tafel_raum + '</td>' +
                    '</tr>');
            });
        },
        error: function (xhr, status, error) {
            alert('Error:', status, error);
        }
    });
    $('.table .spinner-border').remove();
}

// function for getting current week number in following format WW-YYYY
function getCurrentWeekNumber() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const daysSinceStart = (now - startOfYear) / (24 * 60 * 60 * 1000);
    const currentWeek = Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7);

    return ((currentWeek + weekCounter) + '-' + now.getFullYear());
}

// call function getClasses with profession from change event of dropdown professions
$('#professions').on('change', function () {
    getClasses(this.value);
    getTable($('#classes').val(), $('#currentWeek').text());
});

// call function getClasses with profession from change event of dropdown professions
$('#classes').on('change', function () {
    getTable(this.value, $('#currentWeek').text());
});

// get previous week
$('#prevWeek').on('click', function () {
    weekCounter -= 1;
    $('#currentWeek').empty().append(getCurrentWeekNumber());
    getTable($('#classes').val(), $('#currentWeek').text());
});

// get next week
$('#nextWeek').on('click', function () {
    weekCounter += 1;
    $('#currentWeek').empty().append(getCurrentWeekNumber());
    getTable($('#classes').val(), $('#currentWeek').text());
});

// set current week in paginator
$('#currentWeek').empty().append(getCurrentWeekNumber());

// call functions to prefill 
getProfessions();
getClasses();