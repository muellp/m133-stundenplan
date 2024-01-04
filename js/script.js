// apis
const apiProfession = "http://sandbox.gibm.ch/berufe.php"
const apiClass = "http://sandbox.gibm.ch/klassen.php"
const apiTable = "http://sandbox.gibm.ch/tafel.php"

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

function getClasses() {
    $.ajax({
        url: apiClass,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            data.forEach(schoolClass => {
                $('#classes').append('<option value="' + schoolClass.klasse_id + '">' + schoolClass.klasse_name + ', ' + schoolClass.klasse_longname + '</option>');
            });
        },
        error: function (xhr, status, error) {
            alert('Error:', status, error);
        }
    });
}

getProfessions();
getClasses();