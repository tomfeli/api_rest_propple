const authenticationHelper = require("../src/helpers/authenticationHelper");
const myhelper = new authenticationHelper();
test(`test authntication from firebase`, async ()=>{
    const user=await myhelper.createUserWithEmailAndPassword("fiszsontom@gmail.com","vrgretgertgertg");
    console.log(user);
    const logIn = await myhelper.signInWithEmailAndPassword("fiszsontom@gmail.com","vrgretgertgertg");
    console.log(logIn.reloadUserInfo);
    const deleteResponse = await myhelper.deleteUser();
    console.log(deleteResponse)
    expect(true).toBe(true);
});
