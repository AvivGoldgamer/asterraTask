import React ,{useState} from 'react'
import axios from 'axios'

function UserForm() {
    const [userDetails, setUserDetails] = useState({id : "", firstName : "", lastName : "", address : "", phoneNumber : ""});
    const [hobbyDetails, setHobbyDetails] = useState({userId : "", hobby : ""});
    const [toggleState, setToggleState] = useState(1);
    const [errors, setErrors] = useState({});
    const [options, setOptions] = useState([]);

    // Seeting the userid in the hobbyDetails
    const setUserId = (e) => {
        let value = e.target.value.split(" ")[0]

        setHobbyDetails({...hobbyDetails, userId: value})
    }

    // Toogele between tabs + request users list
    const toggleTab = (index) => {
        if(toggleState === 2){
            axios.get("http://localhost:3001/getUser")
            .then(res => {
                setOptions(res.data);
            })
        }
        
        setToggleState(index);
    };

    // Check if any errors are active
    const checkErrors = () => {
        for(let key in errors){
            if(errors[key]){
                return false
            }
        }
        return true
    }

    // Validate function for errors
    const validate = () => {
        if(toggleState === 1){
            if(userDetails.id === ""){
                setErrors(errors => ({...errors, "IDError" : true}));
            }else if(errors.IDError){
                setErrors(errors => ({...errors, "IDError" : false}));
            }

            if(userDetails.firstName === ""){
                setErrors(errors => ({...errors, "FNError" : true}));
            }else if(errors.FNError){
                setErrors(errors => ({...errors, "FNError" : false}));
            }

            if(userDetails.lastName === ""){
                setErrors(errors => ({...errors, "LSError" : true}));
            }else if(errors.LSError){
                setErrors(errors => ({...errors, "LSError" : false}));
            }
            
            if(userDetails.address === ""){
                setErrors(errors => ({...errors, "AddressError" : true}));
            }else if(errors.AddressError){
                setErrors(errors => ({...errors, "AddressError" : false}));
            }

            if(userDetails.phoneNumber === ""){
                setErrors(errors => ({...errors, "PhoneError" : true}));
            }else if(errors.PhoneError){
                setErrors(errors => ({...errors, "PhoneError" : false}));
            }
        }else{
            if(hobbyDetails.userId === ""){
                setErrors(errors => ({...errors, "userIdError" : true}));
            }else{
                setErrors(errors => ({...errors, "userIdError" : false}));
            }
            if(hobbyDetails.hobby === ""){
                setErrors(errors => ({...errors, "hobbyError" : true}));
            }else{
                setErrors(errors => ({...errors, "hobbyError" : false}));
            }
        }
    }


    const submitHandler = e => {
        e.preventDefault();
        
        validate();

        if(checkErrors()){
            if(toggleState === 1){
                axios.post('http://localhost:3001/user', userDetails)
                    .then(res => {
                        console.log(res.data)
                    }).catch(function (err){
                        console.log(err.response)
                    });
            }else{
                axios.post('http://localhost:3001/hobby', hobbyDetails)
                .then(res => {
                    console.log(res.data)
                }).catch(err => {
                    console.log(err.response)
                });
            }
        }
    }

  return (
    <div>
        <div className="bloc-tabs">
            <button
            className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(1)}
            >
            Add user
            </button>
            <button
            className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(2)}
            >
            Add hobby
            </button>
        </div>
        <form onSubmit={submitHandler}>
            <div className="innerForm">
                <div className='tabClass'>
                {toggleState === 1 && <div>
                    <h2>Add User</h2>
                    <div className="formGroup">
                        <label htmlFor="id">ID:</label>
                        <input type="text" name="id" id="id" onChange={e => setUserDetails({...userDetails, id: e.target.value})} value = {userDetails.id}/>
                        {errors.IDError && <label style={{color : "red"}}>*Required</label>}
                    </div>
                    <div className="pair">
                        <div className="formGroup">
                            <label htmlFor="firstName">First Name:</label>
                            <input type="text" name="firstName" id="firstName" onChange={e => setUserDetails({...userDetails, firstName: e.target.value})} value = {userDetails.firstName}/>
                            {errors.FNError && <label style={{color : "red"}}>*Required</label>}
                        </div>
                        <div className="formGroup">
                            <label htmlFor="lastName">Last Name:</label>
                            <input type="text" name="lastName" id="lastName" onChange={e => setUserDetails({...userDetails, lastName: e.target.value})} value = {userDetails.lastName}/>
                            {errors.LSError && <label style={{color : "red"}}>*Required</label>}
                        </div>
                    </div>
                    <div className="pair">
                        <div className="formGroup">
                            <label htmlFor="address">Address:</label>
                            <input type="text" name="address" id="address" onChange={e => setUserDetails({...userDetails, address: e.target.value})} value = {userDetails.address}/>
                            {errors.AddressError && <label style={{color : "red"}}>*Required</label>}
                        </div>
                        <div className="formGroup">
                            <label htmlFor="phoneNumber">Phone Number:</label>
                            <input type="text" name="phoneNumber" id="phoneNumber" onChange={e => setUserDetails({...userDetails, phoneNumber: e.target.value})} value = {userDetails.phoneNumber}/>
                            {errors.PhoneError && <label style={{color : "red"}}>*Required</label>}
                        </div>
                    </div>
                </div>}
                </div>
                <div className="tabClass">
                {toggleState === 2 && <div>
                    <h2>Add Hobby</h2>
                    <div className="formGroup">
                        <label htmlFor="userId">User ID:</label>
                        <select onChange={setUserId}>
                            {options.map((option, index) => {
                                return <option key={option.id}>{option.id + " | " + option.firstname + " " + option.lastname}</option>;
                            })}
                        </select>
                        {errors.userIdError && <label style={{color : "red"}}>*Required</label>}
                    </div>
                    <div className="formGroup">
                        <label htmlFor="firstName">Hobby:</label>
                        <input type="text" name="firstName" id="firstName" onChange={e => setHobbyDetails({...hobbyDetails, hobby: e.target.value})} value = {hobbyDetails.hobby}/>
                        {errors.hobbyError && <label style={{color : "red"}}>*Required</label>}
                    </div>
                </div>}
                </div>
                <div className='submitClass'>
                    <input type="submit" value={toggleState === 1 ? "Create User" : "Add Hobby"} />
                </div>
                
            </div>
        </form>
    </div>
    )
}

export default UserForm;