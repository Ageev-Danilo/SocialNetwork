import emailjs from '@emailjs/browser';

//туть
const SERVICE_ID = 'service_bwc7w3l';
const TEMPLATE_ID = 'template_nkzhzgh';
const PUBLIC_KEY = 'oo2vhpTMpp57OA9Tn';

// export function generateCode(): string {
//    const code =  Math.floor(100000 + Math.random() * 900000).toString();
// }
//  const templateParams = {
//             to_email: email,
//             reset_link: `/home`, 
//             message: "Ви запитали зміну пароля. Натисніть на посилання нижче, щоб встановити новий."
//         };



export async function sendVerificationEmail(
    email: string
){
    return await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
            to_email: email,
            reset_link: `/`,
            message: "asdkajsdkaksd"
            
        },{
        publicKey:'oo2vhpTMpp57OA9Tn',}
    );
}