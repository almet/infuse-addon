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
