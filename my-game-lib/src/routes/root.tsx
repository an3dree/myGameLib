
import AppRoutes from "./Routes";
import FirebaseService from '../services/FirebaseService';

interface Props {
    firebaseService: FirebaseService;
}

const Root: React.FC<Props> = ({ firebaseService }) => { // Adicione firebaseService aos argumentos da função
    return (
        <>
            <AppRoutes firebaseService={firebaseService} />
        </>
    );
};
export default Root;

// export default function Root() {
//     return (
//         <>
//             <AppRoutes />
//         </>
//     )
// }