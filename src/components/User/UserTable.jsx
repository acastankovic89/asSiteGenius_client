import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import AdminTopBar from "../AdminTopBar/AdminTopBar";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";

const UserTable = () => {
  const toast = useRef(null);
  const [allUsers, setAllUsers] = useState();
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
  const [userId, setUserId] = useState(false);

  const navigate = useNavigate();

  const confirmDelete = async () => {
    try {
      const deleteUser =
        await axios.delete(`http://localhost:8080/users/${userId}
      `);
      setDisplayDeleteDialog(false);
      if (deleteUser.data.status === 200) {
        toast.current.show({
          severity: "success",
          detail: deleteUser.data.message,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.current.show({
          severity: "error",
          detail: deleteUser.data.message,
        });
      }
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
  };

  const getAllUsers = async () => {
    try {
      const getAllUsers = await axios.get("http://localhost:8080/users");
      setAllUsers(getAllUsers.data.response);
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
  };

  const actionTemplate = (rowData) => {
    return (
      <div>
        <Button
          icon="pi pi-fw pi-pencil"
          className="p-button-rounded p-button-secondary p-mr-2"
          onClick={() => redirectToUpdate(rowData.id)}
          // Define your edit action function
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => handleDelete(rowData.id)} // Define your delete action function
        />
      </div>
    );
  };

  const redirectToUpdate = (data) => {
    console.log("data", data);
    navigate(`/users/updateUser/${data}`);
  };

  const handleDelete = (data) => {
    setUserId(data);
    setDisplayDeleteDialog(true);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="admin">
      <AdminTopBar />
      <AdminSidebar />
      <div className="adminWrapper">
        <div className="formWrapper menu">
          <Toast ref={toast}></Toast>
          <div className="title">
            <h2>Users Table</h2>
          </div>
          <div className="card">
            <DataTable
              paginator
              value={allUsers}
              rows={5}
              rowsPerPageOptions={(5, 10, 15, 20)}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                field="firstName"
                header="First name"
                style={{ width: "20%" }}
              />

              <Column
                field="lastName"
                header="Last name"
                style={{ width: "20%" }}
              />

              <Column field="email" header="Email" style={{ width: "20%" }} />

              <Column field="role" header="Role" style={{ width: "20%" }} />

              <Column
                field="email"
                header="Action"
                body={actionTemplate}
                style={{ width: "20%" }}
              />
            </DataTable>
          </div>
        </div>
      </div>
      <Dialog
        visible={displayDeleteDialog}
        onHide={() => setDisplayDeleteDialog(false)}
        header="Confirm Deletion"
        footer={
          <div>
            <Button
              label="Yes"
              icon="pi pi-check"
              onClick={confirmDelete}
              className="p-button-danger"
            />
            <Button
              label="No"
              icon="pi pi-times"
              onClick={() => setDisplayDeleteDialog(false)}
              className="p-button-secondary"
            />
          </div>
        }
      >
        Are you sure you want to delete this user?
      </Dialog>
    </div>
  );
};
export default UserTable;
