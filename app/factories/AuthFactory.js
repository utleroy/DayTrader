app.factory("AuthFactory", function(firebaseURL) {
  var ref = new Firebase(firebaseURL);
  var currentUserData;  

  return {
    /*
      Determine if the client is authenticated
     */
    isAuthenticated () {
      let authData = ref.getAuth();
      return (authData) ? true : false;
    },

    getUser () {
      currentUserData = ref.getAuth().uid;
      return currentUserData;
    },

    /*
      Authenticate the client via Firebase
     */
    authenticate (credentials) {
      return new Promise((resolve, reject) => {
        ref.authWithPassword({
          "email": credentials.email,
          "password": credentials.password
        }, (error, authData) => {
          if (error) {
            reject(error);
          } else {
            console.log("authWithPassword method completed successfully");
            currentUserData = authData;
            resolve(authData);
           }
          });
      });
    },

    /*
      Store each Firebase user's id in the `users` collection
     */
    storeUser (authData) {
      var stringifiedUser = JSON.stringify({ uid: authData.uid });

      return new Promise((resolve, reject) => {
        $http
          .post(`${firebaseURL}/users.json`, stringifiedUser)
          .then(
            res => resolve(res),
            err => reject(err)
          );
      });
    }
  };
});