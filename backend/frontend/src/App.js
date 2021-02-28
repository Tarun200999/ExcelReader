import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [isFile, setIsfile] = useState(false);
  const [tablename, setTable] = useState("");
  const [data, setData] = useState([]);
  const [gdata, setGdata] = useState([]);
  const [findby, setFindby] = useState("1");
  const [fieldname, setFieldName] = useState("");
  useEffect(() => {
    if (isFile) {
      fetch(`/showtable/${tablename}`, {
        method: "get",
      })
        .then((res) => res.json())
        .then((res) => {
          setData(res);
          setGdata(res);
        })
        .catch((error) => console.log(error));
    }
  }, [isFile]);
  const filterData = () => {
    if (fieldname.length == "") {
      setData(gdata);
    } else {
      if (findby == "1") {
        const newdata = gdata.filter((item) => {
          return item.Name == fieldname;
        });
        //console.log("newdata", newdata);
        setData(newdata);
      } else {
        const newdata = gdata.filter((item) => {
          return item.Roll_no == fieldname;
        });
        setData(newdata);
      }
    }
  };

  const ChangeFile = () => {
    fetch(`/delete/${tablename}`, {
      method: "delete",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          alert(res.error);
        } else {
          setData([]);
          setTable("");
          setIsfile(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSubmit = (e) => {
    setFieldName(e.target.value);
  };
  const handleFile = () => {
    if (file == null) {
      alert("Choose Excel File");
      return;
    }

    const data = new FormData(); //uploading data to server
    data.append("uploadfile", file);
    fetch("/uploadfile", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          alert(res.error);
        } else {
          setTable(res.tablename);
          setIsfile(true);
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col heading">
            <h1>EXCEL READER</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-9 order-md-2 order-12 tableContent">
            {isFile ? (
              <div className="left_side">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  className="sticky-top p-3 m-2"
                >
                  <input
                    type="text"
                    class="form-control"
                    value={fieldname}
                    onChange={(e) => {
                      setFieldName(e.target.value);
                    }}
                    placeholder={
                      findby == "1" ? "Type Name" : "Type Roll Number"
                    }
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  ></input>
                  <button
                    className="btn btn-success"
                    onClick={() => filterData()}
                  >
                    Search
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setFieldName("");
                      setFindby("1");
                      setData(gdata);
                    }}
                  >
                    Reset
                  </button>
                </div>
                <select
                  class="form-control"
                  onClick={(e) => {
                    setFindby(e.target.value);
                  }}
                >
                  <option value="1">Name</option>
                  <option value="2">Roll_no</option>
                </select>
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Sno</th>
                      <th scope="col">Name</th>
                      <th scope="col">Roll_no</th>
                      <th scope="col">Class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{item.Name}</td>
                          <td>{item.Roll_no}</td>
                          <td>{item.Class}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <h1 className="display-4">Upload File..</h1>
            )}
          </div>
          <div className="col-md-3 order-md-12 order-2 choosefile">
            <div className="sticky-top p-3">
              {isFile ? (
                <button
                  className="btn btn-primary"
                  onClick={() => ChangeFile()}
                >
                  Change File
                </button>
              ) : (
                <div className="chF">
                  <input
                    type="file"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={(e) => setFile(e.target.files[0])}
                  ></input>
                  <button onClick={handleFile} className="btn btn-success">
                    Upload
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
