$('#addReview').submit(function (e) {
    console.log("least our function is working");
    $('.alert.alert-danger').hide();
    if (!$('input#name').val() || !$('select#rating').val() ||
        !$('textarea#review').val()) {
        if ($('.alert.alert-danger').length) {
            console.log("prepend brother is working");
            $('.alert.alert-danger').show();
        } else {
            console.log("prepend is working");
            $(this).prepend('<div role="alert" class="alert alert-danger">All fields required from client, please try again</div>');
        }
        return false;
    }
});