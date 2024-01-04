// apis
const apiProfession = "http://sandbox.gibm.ch/berufe.php"
const apiClass = "http://sandbox.gibm.ch/klassen.php"
const apiTable = "http://sandbox.gibm.ch/tafel.php"

// weekdays
const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// get all Professions and fill "professions" dropdown
function getProfessions() {
    $.ajax({
        url: apiProfession,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            data.forEach(profession => {
                $('#professions').append('<option value="' + profession.beruf_id + '">' + profession.beruf_name + '</option>');
            });
        },
        error: function (xhr, status, error) {
            alert('Error:', status, error);
        }
    });
}

// get schoolClasses with profession parameter and fill "classes" dropdown
// if no profession parameter is present, get all schoolClasses
function getClasses(profession) {
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
                $('#classes').empty()
            }
            data.forEach(schoolClass => {
                $('#classes').append('<option value="' + schoolClass.klasse_id + '">' + schoolClass.klasse_name + ', ' + schoolClass.klasse_longname + '</option>');
            });
        },
        error: function (xhr, status, error) {
            alert('Error:', status, error);
        }
    });
}

function getTable(schoolClass, week = getCurrentWeekNumber()) {
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
            data.forEach(table => {
                $('#table').append('<tr>' +
                    '<td>' + table.tafel_datum + '</td>' +
                    '<td>' + weekday[table.tafel_wochentag] + '</td>' +
                    '<td>' + table.tafel_von + '</td>' +
                    '<td>' + table.tafel_bis + '</td>' +
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
}

function getCurrentWeekNumber() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const daysSinceStart = (now - startOfYear) / (24 * 60 * 60 * 1000);
    const currentWeek = Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7);

    return (currentWeek + '-' + now.getFullYear());
}

$('#professions').on('change', function () {
    getClasses(this.value);
});

getProfessions();
getClasses();

// set current week in paginator
$('#currentWeek').empty().append(getCurrentWeekNumber);