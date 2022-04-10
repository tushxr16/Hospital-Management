import { GoogleAuthProvider } from "firebase/auth";
import { collection,getDocs,addDoc, updateDoc, doc, deleteDoc,arrayUnion, arrayRemove} from "firebase/firestore";
import { useState, useEffect } from "react";
import { Form, Alert, InputGroup,Table, Button } from "react-bootstrap";
import { firestore } from "../Components/Auth/FireBase";
import "./Receiptionist.css";

function Receiptionist() {
  const [doctors, setDoctors] = useState([]);
  const [labs, setLabs] = useState([]);
  const [doctorName,setDoctorName]=useState("");
  const [patientID,setPatientID]=useState("");
  const ref = collection(firestore,"doctor")
  const [message, setMessage] = useState({ error: false, msg: "" });


  // const createUser = async () =>{
  //   await addDoc(ref,{Name:newName,Email:newEmail,Credit:10}) 
  // };

const userCollectionRef = collection(firestore, "doctor");
const getDoctors = async () => {
  const data = await getDocs(userCollectionRef);
  setDoctors(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
};

  const updateUser = async() =>{
    let doctorref = doc(firestore, "doctor", doctorName)
    updateDoc(doctorref,{PatientID: arrayUnion(patientID)}).then(()=>{
      getDoctors();
    });
  };

  const deleteUser= async(id) =>{
    let doctorref = doc(firestore, "doctor", doctorName)
    updateDoc(doctorref,{PatientID: arrayRemove(patientID)}).then(()=>{
      getDoctors();
    });
  }

  useEffect(() => {
    getDoctors();
  }, []);

  useEffect(() => {
    const userCollectionRef = collection(firestore, "lab");
    const getLabs = async () => {
      const data = await getDocs(userCollectionRef);
      setLabs(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getLabs();
  }, []);

  return (
    <>
    <div className="p-4 box">
      {message?.msg && (
          <Alert
            variant={message?.error ? "danger" : "success"}
            dismissible
            onClose={() => setMessage("")}
          >
            {message?.msg}
          </Alert>
        )}
    <Form >
      <Form.Group className="mb-3" controlId="formItemMax">
        <InputGroup>
          <InputGroup.Text id="formItemMax"></InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Doctor ID"
            onChange={(e) => setDoctorName(e.target.value)}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formItemMax">
        <InputGroup>
          <InputGroup.Text id="formItemMax"></InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="patient ID"
            onChange={(e) => setPatientID(e.target.value)}
          />
        </InputGroup>
      </Form.Group>

       <div className="d-grid gap-6">
            <Button variant="primary" type="Submit" onClick={updateUser}>
              Update Patient ID
            </Button>
          </div>
       <div className="d-grid gap-6">
            <Button variant="primary" type="Submit" onClick={deleteUser}>
              Remove Patient ID
            </Button>
          </div>

    </Form>
   
    </div>
   

    <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>NAME</th>
            <th>SPECIALIZATION</th>
            <th>PATIENT ID</th>
            <th>WORKING DAYS</th>
          </tr>
        </thead>
        <tbody>
          {
            doctors.map((doctor,idx) => {
              return (
                <tr key={idx}>
                  <td>{doctor.id}</td>
                  <td>{doctor.Specialization}</td>
                  <td>{doctor.PatientID}</td>
                  <td>{doctor.WorkingDays}</td>
                </tr>
              )
            })
          }
        </tbody>
      </Table>

    </>
  );
}

export default Receiptionist;
