/* =========================================================
   RESUMEAI — ANALYZER JAVASCRIPT
   STEP 2: FILE SELECTION & VALIDATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const resumeFile = document.getElementById("resumeFile");
    const uploadArea = document.getElementById("uploadArea");
    const selectedFile = document.getElementById("selectedFile");

    const fileName = document.getElementById("fileName");
    const fileSize = document.getElementById("fileSize");

    const removeFile = document.getElementById("removeFile");
    const analyzeBtn = document.getElementById("analyzeBtn");


    /* ================= SETTINGS ================= */

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const allowedTypes = [
        "application/pdf",

        "application/msword",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];


    /* ================= FILE INPUT ================= */

    resumeFile.addEventListener("change", () => {

        const file = resumeFile.files[0];

        if (!file) {
            return;
        }

        validateFile(file);

    });


    /* ================= VALIDATE FILE ================= */

    function validateFile(file) {

        if (!allowedTypes.includes(file.type)) {

            alert(
                "Please upload a PDF, DOC, or DOCX resume."
            );

            resetFile();

            return;
        }


        if (file.size > MAX_FILE_SIZE) {

            alert(
                "File size must be less than 5 MB."
            );

            resetFile();

            return;
        }


        showSelectedFile(file);

    }


    /* ================= SHOW FILE ================= */

    function showSelectedFile(file) {

        fileName.textContent = file.name;

        fileSize.textContent = formatFileSize(file.size);


        selectedFile.hidden = false;

        uploadArea.style.display = "none";


        analyzeBtn.disabled = false;


        const extension =
            file.name.split(".").pop().toUpperCase();

        const fileIcon =
            document.querySelector(".file-icon");

        if (fileIcon) {

            fileIcon.textContent = extension;

        }

    }


    /* ================= FILE SIZE ================= */

    function formatFileSize(bytes) {

        if (bytes < 1024) {

            return bytes + " Bytes";

        }

        if (bytes < 1024 * 1024) {

            return (
                (bytes / 1024).toFixed(1) +
                " KB"
            );

        }

        return (
            (bytes / (1024 * 1024)).toFixed(2) +
            " MB"
        );

    }


    /* ================= REMOVE FILE ================= */

    removeFile.addEventListener("click", () => {

        resetFile();

    });


    /* ================= RESET ================= */

    function resetFile() {

        resumeFile.value = "";

        selectedFile.hidden = true;

        uploadArea.style.display = "";

        analyzeBtn.disabled = true;

    }


    /* ================= DRAG & DROP ================= */

    uploadArea.addEventListener(
        "dragover",
        (event) => {

            event.preventDefault();

            uploadArea.classList.add("dragging");

        }
    );


    uploadArea.addEventListener(
        "dragleave",
        () => {

            uploadArea.classList.remove("dragging");

        }
    );


    uploadArea.addEventListener(
        "drop",
        (event) => {

            event.preventDefault();

            uploadArea.classList.remove("dragging");


            const file =
                event.dataTransfer.files[0];

            if (!file) {
                return;
            }


            /*
             * Put dropped file into the file input
             * so the rest of the application can
             * use the same file.
             */

            try {

                const dataTransfer =
                    new DataTransfer();

                dataTransfer.items.add(file);

                resumeFile.files =
                    dataTransfer.files;

            } catch (error) {

                console.log(
                    "Could not attach dropped file.",
                    error
                );

            }


            validateFile(file);

        }
    );


    /* ================= ANALYZE BUTTON ================= */

    analyzeBtn.addEventListener("click", () => {

        const file = resumeFile.files[0];

        if (!file) {

            alert(
                "Please select your resume first."
            );

            return;
        }


        /*
         * Temporary behavior.
         *
         * Actual PDF/DOCX text extraction and
         * AI analysis will be connected in
         * the next steps.
         */

        analyzeBtn.disabled = true;

        analyzeBtn.innerHTML =
            "<span>⏳</span> Preparing Resume...";


        setTimeout(() => {

            analyzeBtn.disabled = false;

            analyzeBtn.innerHTML =
                "<span>✦</span> Analyze My Resume";


            alert(
                "Resume uploaded successfully! " +
                "The AI analysis engine will be connected next."
            );

        }, 1000);

    });


    console.log(
        "ResumeAI Analyzer loaded successfully!"
    );

});