import {getApps, initializeApp, cert} from 'firebase-admin/app'
import {getAuth} from 'firebase-admin/auth'
import {getFirestore} from 'firebase-admin/firestore'

const initFirebaseAdmin=()=>{  //wrapping in a function for lazy initialization
    const apps=getApps()        //lazy initialization- create instance only if needed rather than simply creating an instance irrespective 
                                    //irrespective of the fact wheather your gonna use it or not
    if(!apps.length){
        initializeApp({
            credential:cert({       //credentials to prove the admin backend
                projectId:process.env.FIREBASE_PROJECT_ID,
                clientEmail:process.env.FIREBASE_CLIENT_EMAIL,
                privateKey:process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
            })
        })
    }

    return {
        auth:getAuth(),
        db:getFirestore()
    }
}

export const {auth,db} = initFirebaseAdmin();