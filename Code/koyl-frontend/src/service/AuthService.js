import { Subject } from 'rxjs'
import CryptoJS from "crypto-js"

export default class AuthService {

    static LoggedInUserDetails = new Subject();

    static encrypt(text) {
        return CryptoJS.AES.encrypt(text, process.env.REACT_APP_CRYPTO_SECRET).toString();
    }
    static decrypt(text) {
        var bytes = CryptoJS.AES.decrypt(text, process.env.REACT_APP_CRYPTO_SECRET);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    static getAuthtoken = () => {
        let token = localStorage.getItem("authtoken")
        if (!token || token === null || token === undefined) { return { isToken: false } }
        return { token: token, isToken: true }

    }

    static UpdateLoggedInUserDetails = (data) => {
        
        this.LoggedInUserDetails.next(data);
    }

    static GetLoggedInUserData = () => {
        const token = JSON.parse(this.decrypt(this.getAuthtoken()?.token))
        const parts = token.split('.');
        const payload = JSON.parse(window.atob(parts[1]));
        return { ...payload };

    }

    static LoggedInUserSession = (token) => {
        localStorage.setItem("authtoken", this.encrypt(JSON.stringify(token)));

        const updatedUserData = this.GetLoggedInUserData();
        this.UpdateLoggedInUserDetails(updatedUserData);
    }
}