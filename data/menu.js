/**
 * Emit a toogleActivation event when the checkbox is toogled
 **/
$("#active").change(function(){
    self.port.emit("toogle-plugin");
});

/**
 * When submitting the credentials, fire a update_credentials
 * event.
 **/
$("#credentials-form").submit(function(event){
    event.stopPropagation();
    self.port.emit("update-credentials", {
        username: this.name.value, 
        password: this.password.value
    });

    return false;
});

self.port.on("credentials-checked", function(is_valid){
    if (is_valid != true){
        $("#info").html("<p class='error'>The credentials you entered are not matching to an user on the server. Please check for any typo and be sure you are registered</p>"); 
    } else {
        $("#info").html("<p class='info'>You are now connected and sending data to the server. Thanks !</p>");
    }
});
