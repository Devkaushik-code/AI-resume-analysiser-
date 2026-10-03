const pdfjsLib = window.pdfjsLib;

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

document.addEventListener("DOMContentLoaded", () => {

    const resumeFile = document.getElementById("resumeFile");
    const uploadArea = document.getElementById("uploadArea");
    const selectedFile = document.getElementById("selectedFile");

    const fileName = document.getElementById("fileName");
    const fileSize = document.getElementById("fileSize");

    const removeFile = document.getElementById("removeFile");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const chooseResume = document.getElementById("chooseResume");


    /* ================= SETTINGS ================= */

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];


    /* ================= CHOOSE RESUME ================= */

    chooseResume.addEventListener("click", () => {
        resumeFile.click();
    });


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

        const extension = file.name
            .split(".")
            .pop()
            .toLowerCase();

        const validExtension =
            extension === "pdf" ||
            extension === "docx";

        if (!validExtension || !allowedTypes.includes(file.type)) {

            alert("Please upload a PDF or DOCX resume.");

            resetFile();

            return;
        }


        if (file.size > MAX_FILE_SIZE) {

            alert("File size must be less than 5 MB.");

            resetFile();

            return;
        }


        showSelectedFile(file);

    }


    /* ================= SHOW FILE ================= */

    function showSelectedFile(file) {

        fileName.textContent = file.name;

        fileSize.textContent =
            formatFileSize(file.size);

        selectedFile.hidden = false;

        uploadArea.style.display = "none";

        analyzeBtn.disabled = false;

        const extension =
            file.name
                .split(".")
                .pop()
                .toUpperCase();

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

    uploadArea.addEventListener("dragover", (event) => {

        event.preventDefault();

        uploadArea.classList.add("dragging");

    });


    uploadArea.addEventListener("dragleave", () => {

        uploadArea.classList.remove("dragging");

    });


    uploadArea.addEventListener("drop", (event) => {

        event.preventDefault();

        uploadArea.classList.remove("dragging");

        const file =
            event.dataTransfer.files[0];

        if (!file) {
            return;
        }

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

    });


    /* ================= ANALYZE ================= */

    analyzeBtn.addEventListener("click", async () => {

        const file = resumeFile.files[0];

        if (!file) {

            alert("Please select your resume first.");

            return;
        }


        analyzeBtn.disabled = true;

        analyzeBtn.innerHTML =
            "<span>⏳</span> Reading Resume...";


        try {

            let text = "";

            const extension =
                file.name
                    .split(".")
                    .pop()
                    .toLowerCase();


            /* ================= PDF ================= */

            if (extension === "pdf") {

                text = await extractPDFText(file);

            }


            /* ================= DOCX ================= */

            else if (extension === "docx") {

                text = await extractDOCXText(file);

            }


            text = cleanText(text);


            if (!text || text.length < 20) {

                throw new Error(
                    "Very little text was found in this resume."
                );

            }


            /* ================= SAVE TEXT ================= */

            sessionStorage.setItem(
                "resumeText",
                text
            );

            sessionStorage.setItem(
                "resumeFileName",
                file.name
            );


            analyzeBtn.innerHTML =
                "<span>✓</span> Resume Read Successfully";


            console.log(
                "Resume text extracted:",
                text
            );

            console.log(
                "Characters:",
                text.length
            );


            alert(
                "Resume read successfully!\n\n" +
                "Extracted characters: " +
                text.length +
                "\n\nThe resume is ready for AI analysis."
            );


            analyzeBtn.disabled = false;

            analyzeBtn.innerHTML =
                "<span>✦</span> Analyze My Resume";


        } catch (error) {

            console.error(
                "Resume extraction error:",
                error
            );

            alert(
                "Could not read this resume.\n\n" +
                "Please make sure the PDF/DOCX contains selectable text."
            );

            analyzeBtn.disabled = false;

            analyzeBtn.innerHTML =
                "<span>✦</span> Analyze My Resume";

        }

    });


    /* ================= PDF EXTRACTION ================= */

    async function extractPDFText(file) {

        const arrayBuffer =
            await file.arrayBuffer();

        const pdf =
            await pdfjsLib.getDocument({
                data: arrayBuffer
            }).promise;


        let fullText = "";


        for (
            let pageNumber = 1;
            pageNumber <= pdf.numPages;
            pageNumber++
        ) {

            const page =
                await pdf.getPage(pageNumber);

            const textContent =
                await page.getTextContent();


            const pageText =
                textContent.items
                    .map(item => item.str)
                    .join(" ");


            fullText +=
                pageText + "\n";

        }


        return fullText;

    }


    /* ================= DOCX EXTRACTION ================= */

    async function extractDOCXText(file) {

        const arrayBuffer =
            await file.arrayBuffer();


        const result =
            await mammoth.extractRawText({
                arrayBuffer: arrayBuffer
            });


        return result.value;

    }


    /* ================= CLEAN TEXT ================= */

    function cleanText(text) {

        return text
            .replace(/\r/g, "")
            .replace(/[ \t]+/g, " ")
            .replace(/\n{3,}/g, "\n\n")
            .trim();

    }


    console.log(
        "ResumeAI Analyzer Stage 3 loaded successfully!"
    );

});
