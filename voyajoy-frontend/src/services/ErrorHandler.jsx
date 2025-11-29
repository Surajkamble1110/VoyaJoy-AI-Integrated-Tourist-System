
export const getErrorMessage=(error)=>{

    if(error.response?.data?.message){

        return error.response.data.message; 
    }

    if(error.message){

        return error.message;
    }

    return "An unexpected error occured!";

};



const ErrorHandler = ({error, onClose}) => {

    if(!error){
        return null;
    }

   
 const status = error.response?.status;
const message = getErrorMessage(error);

const unauthorizedError = status=== 401;
const unauthorizedErrorSpecificRole = status === 403;
const resourceNotFound = status === 404;
const badRequest = status === 400;
const internalServerError = 500;

const getColor=()=>{
    if(unauthorizedError){
        
return  'bg-yellow-100 text-yellow-700';
    }

    if(unauthorizedErrorSpecificRole) {
        
        return 'bg-blue-100 text-blue-700'; 
    }

    if(resourceNotFound) {
        
        return 'bg-orange-100 text-orange-700';
    }


    if(badRequest) {
        
        return  'bg-red-100 text-red-700'; 
    }


    if(internalServerError) {
        return   'bg-red-100 text-red-700';

    }

     return  'bg-red-100 text-red-700';

}

    return (

    <div className={`${getColor()} p-4 rounded-lg mb-4 flex justify-between items-center`}>
      <div>
        <p className="text-lg font-semibold">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-xl font-bold hover:opacity-70"
      >
        ✕
      </button>
    </div>

  );
};

export default ErrorHandler;