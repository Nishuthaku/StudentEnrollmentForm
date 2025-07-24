var token = "90934954|-31949250420634759|90959540";
var dbName = "SCHOOL-DB";
var relationName = "STUDENT-TABLE";
var baseUrl = "http://api.login2explore.com:5577";
var irl = "/api/irl";
var iml = "/api/iml";

function initForm() {
    document.getElementById("rollNo").focus();
    disableAllExceptRollNo();
    document.getElementById("rollNo").addEventListener("blur", checkRollNo);
}

function disableAllExceptRollNo() {
    ["fullName", "studentClass", "birthDate", "address", "enrollDate"].forEach(id => {
        document.getElementById(id).disabled = true;
    });
    document.getElementById("saveBtn").disabled = true;
    document.getElementById("updateBtn").disabled = true;
}

function enableForm() {
    ["fullName", "studentClass", "birthDate", "address", "enrollDate"].forEach(id => {
        document.getElementById(id).disabled = false;
    });
}

function checkRollNo() {
    let roll = document.getElementById("rollNo").value.trim();
    if (!roll) return;

    let getReq = createGET_BY_KEYRequest(token, dbName, relationName, JSON.stringify({ Roll_No: roll }));
    let res = executeCommandAtGivenBaseUrl(getReq, baseUrl, irl);
    let data = JSON.parse(res);

    if (!data.data) {
        enableForm();
        document.getElementById("saveBtn").disabled = false;
    } else {
        fillForm(JSON.parse(data.data).record);
        document.getElementById("updateBtn").disabled = false;
    }
}

function fillForm(data) {
    document.getElementById("rollNo").disabled = true;
    document.getElementById("fullName").value = data.Full_Name;
    document.getElementById("studentClass").value = data.Class;
    document.getElementById("birthDate").value = data.Birth_Date;
    document.getElementById("address").value = data.Address;
    document.getElementById("enrollDate").value = data.Enrollment_Date;
    enableForm();
}

function getFormData() {
    return {
        Roll_No: document.getElementById("rollNo").value.trim(),
        Full_Name: document.getElementById("fullName").value.trim(),
        Class: document.getElementById("studentClass").value.trim(),
        Birth_Date: document.getElementById("birthDate").value,
        Address: document.getElementById("address").value.trim(),
        Enrollment_Date: document.getElementById("enrollDate").value
    };
}

function saveData() {
    let data = getFormData();
    if (Object.values(data).some(v => !v)) return alert("Please fill all fields.");
    let req = createPUTRequest(token, JSON.stringify(data), dbName, relationName);
    executeCommandAtGivenBaseUrl(req, baseUrl, iml);
    resetForm();
    alert("Data saved.");
}

function updateData() {
    let data = getFormData();
    if (Object.values(data).some(v => !v)) return alert("Please fill all fields.");
    let updateReq = createUPDATERecordRequest(token, JSON.stringify(data), dbName, relationName, JSON.stringify({ Roll_No: data.Roll_No }));
    executeCommandAtGivenBaseUrl(updateReq, baseUrl, iml);
    resetForm();
    alert("Data updated.");
}

function resetForm() {
    document.querySelectorAll("input").forEach(input => {
        input.value = "";
        input.disabled = input.id !== "rollNo";
    });
    document.getElementById("rollNo").disabled = false;
    document.getElementById("saveBtn").disabled = true;
    document.getElementById("updateBtn").disabled = true;
    document.getElementById("rollNo").focus();
}