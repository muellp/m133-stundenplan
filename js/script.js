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
            data.forEach(element => {
                console.log(element)
            });
        },
        error: function (xhr, status, error) {
            alert('Error:', status, error);
        }
    });

}

getProfessions();