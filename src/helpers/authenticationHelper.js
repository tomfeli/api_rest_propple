const {myAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendEmailVerification,deleteUser,updatePassword,sendPasswordResetEmail} = require("../services/firebase");

class authenticationHelper{
    async createUserWithEmailAndPassword(email,password){
        try{
            const userCredential= await createUserWithEmailAndPassword(myAuth,email, password);
            await sendEmailVerification(myAuth.currentUser);
            return userCredential.user;
        }
        catch(error){
            throw error;
        }
    }
    async updatePassword(newPassword){
        try{
        await updatePassword(myAuth.currentUser, newPassword);
        }
        catch(err){
            throw err;
        }
    }
    async signInWithEmailAndPassword(email, password){
        try{
            const userCredential= await signInWithEmailAndPassword(myAuth,email, password);
            return userCredential.user;
        }
        catch(error){
            throw error;
        }
    }
    async deleteUser(){
        try{
            await deleteUser(myAuth.currentUser);
            return true;
        }
        catch(error){
            throw error;
        }
    }
    async sendPasswordResetEmail(mail){
        try{
            await sendPasswordResetEmail(myAuth,mail);
        }
        catch(error){
            throw error;
        }
    }
}
module.exports=authenticationHelper;