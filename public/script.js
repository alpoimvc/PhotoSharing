// Get the modal
var modal = document.getElementById('registerModal');
var loginButton = document.getElementById('loginButton');
var registerButton = document.getElementById('registerButton');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function yourFunction(){
    var action_src = "http://localhost:3000/send/" + document.getElementsByName("typeahead")[0].value;
    var your_form = document.getElementById('myForm');
    your_form.action = action_src;
}

function createObjectURL(object) {
    return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
}

function revokeObjectURL(url) {
    return (window.URL) ? window.URL.revokeObjectURL(url) : window.webkitURL.revokeObjectURL(url);
}

function myUploadOnChangeFunction() {
    if(this.files.length) {
        for(var i in this.files) {
            if(this.files.hasOwnProperty(i)){
	            var src = createObjectURL(this.files[i]);
	            $('#img').attr('src', src);
            }
        }
    }
}

$(document).ready(function(){
    $('input.typeahead').typeahead({
        name: 'typeahead',
        remote: 'http://localhost:3000/search?key=%QUERY',
        limit: 10
    });
    $('#file').change(myUploadOnChangeFunction);
    $('#file2').change(myUploadOnChangeFunction);
});

function gridClick(_src) {
console.log(_src);
    var modal = document.getElementById('modal');
    var image = document.getElementById('images');
    var modalImg = document.getElementById("img01");
    image.onclick = function(){
    modal.style.display = "block";
    modalImg.src = _src;
    }

    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() { 
    modal.style.display = "none";
    }
}