import { useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { useToast } from "@/Components/ui/use-toast";
import { NotificationModal } from "@/Components/ui/notification-modal";
import {
    Check,
    FileText,
    MapPin,
    User,
    Building2,
    Home,
    Mail,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";

export default function RequestForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [hasRepresentative, setHasRepresentative] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [notificationModal, setNotificationModal] = useState({
        isOpen: false,
        type: "success",
        title: "",
        message: "",
        buttonText: "Continue",
    });
    const { toast } = useToast();
    const page = usePage();
    const flash = page.props.flash || {};
    const { data, setData, post, processing, errors, reset } = useForm({
        // Page 1: Applicant Information
        applicant_name: "",
        corporation_name: "",
        applicant_address: "",
        corporation_address: "",
        authorized_representative_name: "",
        authorized_representative_address: "",
        authorized_representative_email: "",
        authorization_letter: null,

        // Page 2: Project Details
        project_type: "",
        project_nature: "",
        project_location_number: "",
        project_location_street: "",
        project_location_barangay: "",
        project_location_municipality: "",
        project_location_province: "",
        project_area_sqm: "",
        lot_area_sqm: "",
        bldg_improvement_sqm: "",
        right_over_land: "",
        project_nature_duration: "",
        project_nature_years: "",
        project_cost: "",

        // Page 3: Land Uses
        existing_land_use: "",
        has_written_notice: "",
        notice_officer_name: "",
        notice_dates: "",
        has_similar_application: "",
        similar_application_offices: "",
        similar_application_dates: "",
        preferred_release_mode: "",
        release_address: "",
    });

    const validateForm = () => {
        const requiredFields = {
            // Step 1: Applicant Information (Always Required)
            applicant_name: "Applicant Name",
            applicant_address: "Applicant Address",

            // Step 2: Project Details (Required)
            project_type: "Project Type",
            project_nature: "Project Nature",
            project_location_street: "Project Location Street",
            project_location_barangay: "Project Location Barangay",
            project_location_municipality: "Project Location Municipality/City",
            project_location_province: "Project Location Province",
            project_area_sqm: "Project Area (sqm)",
            lot_area_sqm: "Lot Area (sqm)",
            right_over_land: "Right Over Land",
            project_nature_duration: "Project Nature Duration",
            project_cost: "Project Cost",

            // Step 3: Land Use Information (Required)
            existing_land_use: "Existing Land Use",
            has_written_notice: "Written Notice to Tenants",
            has_similar_application: "Similar Application Filed",
            preferred_release_mode: "Preferred Release Mode",
        };

        // Conditional required fields
        const conditionalFields = {};

        // If has representative, require representative details
        if (hasRepresentative) {
            conditionalFields.authorized_representative_name =
                "Authorized Representative Name";
            conditionalFields.authorized_representative_address =
                "Authorized Representative Address";
            conditionalFields.authorized_representative_email =
                "Authorized Representative Email";
            conditionalFields.authorization_letter = "Authorization Letter";
        }

        // If project is temporary, require years
        if (data.project_nature_duration === "Temporary") {
            conditionalFields.project_nature_years = "Project Duration (Years)";
        }

        // If written notice is yes, require officer details
        if (data.has_written_notice === "yes") {
            conditionalFields.notice_officer_name = "Notice Officer Name";
            conditionalFields.notice_dates = "Notice Dates";
        }

        // If similar application is yes, require details
        if (data.has_similar_application === "yes") {
            conditionalFields.similar_application_offices =
                "Similar Application Offices";
            conditionalFields.similar_application_dates =
                "Similar Application Dates";
        }

        // If preferred release mode is mail, require address
        if (data.preferred_release_mode === "mail") {
            conditionalFields.release_address = "Release Address";
        }

        // Combine all required fields
        const allRequiredFields = { ...requiredFields, ...conditionalFields };
        const emptyFields = [];

        for (const [field, label] of Object.entries(allRequiredFields)) {
            if (field === "authorization_letter") {
                // Special handling for file upload
                if (!data[field]) {
                    emptyFields.push(label);
                }
            } else if (!data[field] || data[field].toString().trim() === "") {
                emptyFields.push(label);
            }
        }

        // Additional validation for numeric fields
        const numericFields = [
            "project_area_sqm",
            "lot_area_sqm",
            "project_cost",
        ];
        for (const field of numericFields) {
            if (
                data[field] &&
                (isNaN(data[field]) || parseFloat(data[field]) <= 0)
            ) {
                emptyFields.push(
                    `${allRequiredFields[field]} (must be a positive number)`
                );
            }
        }

        // Email validation if corporation email is provided
        if (
            data.corporation_email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.corporation_email)
        ) {
            emptyFields.push("Valid Corporation Email");
        }

        if (emptyFields.length > 0) {
            // Organize errors by section
            const step1Errors = validateStep(1);
            const step2Errors = validateStep(2);
            const step3Errors = validateStep(3);

            let errorMessage =
                "Please complete all required fields before submitting your application:\n\n";

            if (step1Errors.length > 0) {
                errorMessage += "📝 APPLICANT INFORMATION:\n";
                errorMessage +=
                    step1Errors.map((error) => `   • ${error}`).join("\n") +
                    "\n\n";
            }

            if (step2Errors.length > 0) {
                errorMessage += "🏗️ PROJECT DETAILS:\n";
                errorMessage +=
                    step2Errors.map((error) => `   • ${error}`).join("\n") +
                    "\n\n";
            }

            if (step3Errors.length > 0) {
                errorMessage += "🏞️ LAND USE INFORMATION:\n";
                errorMessage +=
                    step3Errors.map((error) => `   • ${error}`).join("\n") +
                    "\n\n";
            }

            errorMessage +=
                "💡 Tip: You can navigate to any section using the step indicators above to complete the missing fields.";

            setNotificationModal({
                isOpen: true,
                type: "warning",
                title: "Complete Required Fields",
                message: errorMessage,
                buttonText: "OK, I'll Complete the Form",
            });
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Comprehensive validation check
        if (!validateForm()) {
            return; // validateForm() already shows the detailed error modal
        }

        // Show confirmation dialog
        setIsConfirmDialogOpen(true);
    };

    const confirmSubmit = () => {
        if (processing) return; // Prevent double submission

        post(route("request.store"), {
            preserveScroll: true,
            onSuccess: (page) => {
                const successMessage =
                    page.props.flash?.success ||
                    "Your application has been submitted successfully! You will receive a confirmation email shortly.";
                setIsConfirmDialogOpen(false);
                setNotificationModal({
                    isOpen: true,
                    type: "success",
                    title: "Success!",
                    message: successMessage,
                    buttonText: "Continue",
                });
                reset();
                setCurrentStep(1);
                setCompletedSteps([]);
                setHasRepresentative(false);
            },
            onError: (errors) => {
                setIsConfirmDialogOpen(false);
                const errorMessage =
                    "There was an error submitting your application. Please check the form and try again.";
                setNotificationModal({
                    isOpen: true,
                    type: "error",
                    title: "Error!",
                    message: errorMessage,
                    buttonText: "Try Again",
                });
            },
        });
    };

    useEffect(() => {
        if (flash?.success) {
            toast({
                title: "Success!",
                description: flash.success,
                duration: 5000,
            });
        }
    }, [flash?.success]);

    const validateStep = (step) => {
        const errors = [];

        if (step === 1) {
            // Step 1: Applicant Information
            if (!data.applicant_name || data.applicant_name.trim() === "") {
                errors.push("Applicant Name");
            }
            if (
                !data.applicant_address ||
                data.applicant_address.trim() === ""
            ) {
                errors.push("Applicant Address");
            }

            // If has representative, validate representative fields
            if (hasRepresentative) {
                if (
                    !data.authorized_representative_name ||
                    data.authorized_representative_name.trim() === ""
                ) {
                    errors.push("Authorized Representative Name");
                }
                if (
                    !data.authorized_representative_address ||
                    data.authorized_representative_address.trim() === ""
                ) {
                    errors.push("Authorized Representative Address");
                }
                if (
                    !data.authorized_representative_email ||
                    data.authorized_representative_email.trim() === ""
                ) {
                    errors.push("Authorized Representative Email");
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.authorized_representative_email)) {
                    errors.push("Valid Authorized Representative Email");
                }
                if (!data.authorization_letter) {
                    errors.push("Authorization Letter");
                }
            }
        } else if (step === 2) {
            // Step 2: Project Details
            const requiredStep2Fields = {
                project_type: "Project Type",
                project_nature: "Project Nature",
                project_location_street: "Project Location Street",
                project_location_barangay: "Project Location Barangay",
                project_location_municipality:
                    "Project Location Municipality/City",
                project_location_province: "Project Location Province",
                project_area_sqm: "Project Area (sqm)",
                lot_area_sqm: "Lot Area (sqm)",
                right_over_land: "Right Over Land",
                project_nature_duration: "Project Nature Duration",
                project_cost: "Project Cost",
            };

            for (const [field, label] of Object.entries(requiredStep2Fields)) {
                if (!data[field] || data[field].toString().trim() === "") {
                    errors.push(label);
                }
            }

            // If temporary project, require years
            if (data.project_nature_duration === "Temporary") {
                if (
                    !data.project_nature_years ||
                    data.project_nature_years.toString().trim() === ""
                ) {
                    errors.push("Project Duration (Years)");
                }
            }

            // Validate numeric fields
            const numericFields = [
                "project_area_sqm",
                "lot_area_sqm",
                "project_cost",
            ];
            for (const field of numericFields) {
                if (
                    data[field] &&
                    (isNaN(data[field]) || parseFloat(data[field]) <= 0)
                ) {
                    errors.push(
                        `${requiredStep2Fields[field]} (must be a positive number)`
                    );
                }
            }
        } else if (step === 3) {
            // Step 3: Land Use Information
            const requiredStep3Fields = {
                existing_land_use: "Existing Land Use",
                has_written_notice: "Written Notice to Tenants",
                has_similar_application: "Similar Application Filed",
                preferred_release_mode: "Preferred Release Mode",
            };

            for (const [field, label] of Object.entries(requiredStep3Fields)) {
                if (!data[field] || data[field].toString().trim() === "") {
                    errors.push(label);
                }
            }

            // Conditional validations
            if (data.has_written_notice === "yes") {
                if (
                    !data.notice_officer_name ||
                    data.notice_officer_name.trim() === ""
                ) {
                    errors.push("Notice Officer Name");
                }
                if (!data.notice_dates || data.notice_dates.trim() === "") {
                    errors.push("Notice Dates");
                }
            }

            if (data.has_similar_application === "yes") {
                if (
                    !data.similar_application_offices ||
                    data.similar_application_offices.trim() === ""
                ) {
                    errors.push("Similar Application Offices");
                }
                if (
                    !data.similar_application_dates ||
                    data.similar_application_dates.trim() === ""
                ) {
                    errors.push("Similar Application Dates");
                }
            }

            if (data.preferred_release_mode === "mail_other") {
                if (
                    !data.release_address ||
                    data.release_address.trim() === ""
                ) {
                    errors.push("Release Address");
                }
            }

            // Validate that authorized representative exists if mail_representative is selected
            if (data.preferred_release_mode === "mail_representative" && !hasRepresentative) {
                errors.push("Authorized Representative (required for mail to representative option)");
            }
        }

        return errors;
    };

    const isStepFilled = (step) => {
        const errors = validateStep(step);
        return errors.length === 0;
    };

    const nextStep = (e) => {
        e.preventDefault();

        if (currentStep < 3) {
            // Mark current step as completed if filled (optional visual feedback)
            if (
                isStepFilled(currentStep) &&
                !completedSteps.includes(currentStep)
            ) {
                setCompletedSteps([...completedSteps, currentStep]);

                // Show step completion notification
                const stepNames = {
                    1: "Applicant Information",
                    2: "Project Details",
                };

                toast({
                    title: "Step Completed!",
                    description: `${stepNames[currentStep]} has been completed successfully.`,
                    duration: 3000,
                });
            }
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = (e) => {
        e.preventDefault();
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-8 bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => setCurrentStep(1)}
                >
                    <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all hover:scale-110 ${
                            currentStep >= 1
                                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md"
                                : "bg-gray-200 text-gray-500"
                        }`}
                    >
                        {completedSteps.includes(1) ? (
                            <Check className="h-6 w-6" />
                        ) : (
                            "1"
                        )}
                    </div>
                    <span
                        className={`text-sm ${
                            currentStep >= 1
                                ? "font-bold text-blue-900"
                                : "text-gray-500"
                        }`}
                    >
                        Applicant Info
                    </span>
                </div>
                <div className="flex-1 h-2 mx-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 ${
                            currentStep >= 2
                                ? "bg-gradient-to-r from-blue-600 to-blue-700"
                                : "bg-gray-200"
                        }`}
                        style={{ width: currentStep >= 2 ? "100%" : "0%" }}
                    ></div>
                </div>
                <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => setCurrentStep(2)}
                >
                    <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all hover:scale-110 ${
                            currentStep >= 2
                                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md"
                                : "bg-gray-200 text-gray-500"
                        }`}
                    >
                        {completedSteps.includes(2) ? (
                            <Check className="h-6 w-6" />
                        ) : (
                            "2"
                        )}
                    </div>
                    <span
                        className={`text-sm ${
                            currentStep >= 2
                                ? "font-bold text-blue-900"
                                : "text-gray-500"
                        }`}
                    >
                        Project Details
                    </span>
                </div>
                <div className="flex-1 h-2 mx-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 ${
                            currentStep >= 3
                                ? "bg-gradient-to-r from-blue-600 to-blue-700"
                                : "bg-gray-200"
                        }`}
                        style={{ width: currentStep >= 3 ? "100%" : "0%" }}
                    ></div>
                </div>
                <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => setCurrentStep(3)}
                >
                    <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all hover:scale-110 ${
                            currentStep >= 3
                                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md"
                                : "bg-gray-200 text-gray-500"
                        }`}
                    >
                        {completedSteps.includes(3) ? (
                            <Check className="h-6 w-6" />
                        ) : (
                            "3"
                        )}
                    </div>
                    <span
                        className={`text-sm ${
                            currentStep >= 3
                                ? "font-bold text-blue-900"
                                : "text-gray-500"
                        }`}
                    >
                        Land Uses
                    </span>
                </div>
            </div>

            {/* Page 1: Applicant Information */}
            {currentStep === 1 && (
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="applicant_name">
                            Name of Applicant{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="applicant_name"
                            value={data.applicant_name}
                            onChange={(e) =>
                                setData("applicant_name", e.target.value)
                            }
                            placeholder="Enter applicant name"
                        />
                        {errors.applicant_name && (
                            <p className="text-sm text-red-500">
                                {errors.applicant_name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="corporation_name">
                            Name of Corporation
                        </Label>
                        <Input
                            id="corporation_name"
                            value={data.corporation_name}
                            onChange={(e) =>
                                setData("corporation_name", e.target.value)
                            }
                            placeholder="Enter corporation name"
                        />
                        {errors.corporation_name && (
                            <p className="text-sm text-red-500">
                                {errors.corporation_name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="applicant_address">
                            Address of Applicant{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="applicant_address"
                            value={data.applicant_address}
                            onChange={(e) =>
                                setData("applicant_address", e.target.value)
                            }
                            placeholder="Enter applicant address"
                        />
                        {errors.applicant_address && (
                            <p className="text-sm text-red-500">
                                {errors.applicant_address}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="corporation_address">
                            Address of Corporation
                        </Label>
                        <Textarea
                            id="corporation_address"
                            value={data.corporation_address}
                            onChange={(e) =>
                                setData("corporation_address", e.target.value)
                            }
                            placeholder="Enter corporation address"
                        />
                        {errors.corporation_address && (
                            <p className="text-sm text-red-500">
                                {errors.corporation_address}
                            </p>
                        )}
                    </div>

                    {/* Has Authorized Representative Checkbox */}
                    <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="has_representative"
                                checked={hasRepresentative}
                                onChange={(e) => {
                                    setHasRepresentative(e.target.checked);
                                    if (!e.target.checked) {
                                        setData(
                                            "authorized_representative_name",
                                            ""
                                        );
                                        setData(
                                            "authorized_representative_address",
                                            ""
                                        );
                                        setData(
                                            "authorized_representative_email",
                                            ""
                                        );
                                        setData("authorization_letter", null);
                                    }
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label
                                htmlFor="has_representative"
                                className="font-medium cursor-pointer"
                            >
                                Do you have an Authorized Representative?
                            </Label>
                        </div>
                    </div>

                    {/* Conditional Representative Fields */}
                    {hasRepresentative && (
                        <>
                            <div className="space-y-2 md:col-span-2">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        Please fill in the representative
                                        details and upload the authorization
                                        letter.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="authorized_representative_name">
                                    Name of Authorized Representative{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="authorized_representative_name"
                                    value={data.authorized_representative_name}
                                    onChange={(e) =>
                                        setData(
                                            "authorized_representative_name",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter representative name"
                                    required={hasRepresentative}
                                />
                                {errors.authorized_representative_name && (
                                    <p className="text-sm text-red-500">
                                        {errors.authorized_representative_name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="authorized_representative_email">
                                    Email of Authorized Representative{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="authorized_representative_email"
                                    type="email"
                                    value={data.authorized_representative_email}
                                    onChange={(e) =>
                                        setData(
                                            "authorized_representative_email",
                                            e.target.value
                                        )
                                    }
                                    placeholder="representative@example.com"
                                    required={hasRepresentative}
                                />
                                {errors.authorized_representative_email && (
                                    <p className="text-sm text-red-500">
                                        {errors.authorized_representative_email}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="authorization_letter">
                                    Authorization Letter{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="authorization_letter"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) =>
                                        setData(
                                            "authorization_letter",
                                            e.target.files[0]
                                        )
                                    }
                                    className="cursor-pointer"
                                    required={hasRepresentative}
                                />
                                <p className="text-xs text-gray-500">
                                    Accepted formats: PDF, JPG, PNG (Max 5MB)
                                </p>
                                {errors.authorization_letter && (
                                    <p className="text-sm text-red-500">
                                        {errors.authorization_letter}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="authorized_representative_address">
                                    Address of Authorized Representative{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="authorized_representative_address"
                                    value={
                                        data.authorized_representative_address
                                    }
                                    onChange={(e) =>
                                        setData(
                                            "authorized_representative_address",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter representative address"
                                    required={hasRepresentative}
                                />
                                {errors.authorized_representative_address && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors.authorized_representative_address
                                        }
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Page 2: Project Details */}
            {currentStep === 2 && (
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="project_type">
                            Project Type <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="project_type"
                            value={data.project_type}
                            onChange={(e) =>
                                setData("project_type", e.target.value)
                            }
                            placeholder="Enter project type"
                        />
                        {errors.project_type && (
                            <p className="text-sm text-red-500">
                                {errors.project_type}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="project_nature">
                            Project Nature{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="project_nature"
                            value={data.project_nature}
                            onChange={(e) =>
                                setData("project_nature", e.target.value)
                            }
                            placeholder="Enter project nature"
                        />
                        {errors.project_nature && (
                            <p className="text-sm text-red-500">
                                {errors.project_nature}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label className="text-base font-semibold">
                            Project Location
                        </Label>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="project_location_number">Number</Label>
                        <Input
                            id="project_location_number"
                            value={data.project_location_number}
                            onChange={(e) =>
                                setData(
                                    "project_location_number",
                                    e.target.value
                                )
                            }
                            placeholder="House/Building number"
                        />
                        {errors.project_location_number && (
                            <p className="text-sm text-red-500">
                                {errors.project_location_number}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="project_location_street">
                            Street <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="project_location_street"
                            value={data.project_location_street}
                            onChange={(e) =>
                                setData(
                                    "project_location_street",
                                    e.target.value
                                )
                            }
                            placeholder="Street name"
                        />
                        {errors.project_location_street && (
                            <p className="text-sm text-red-500">
                                {errors.project_location_street}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="project_location_barangay">
                            Barangay <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="project_location_barangay"
                            value={data.project_location_barangay}
                            onChange={(e) =>
                                setData(
                                    "project_location_barangay",
                                    e.target.value
                                )
                            }
                            placeholder="Barangay"
                        />
                        {errors.project_location_barangay && (
                            <p className="text-sm text-red-500">
                                {errors.project_location_barangay}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="project_location_municipality">
                            Municipality <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="project_location_municipality"
                            value={data.project_location_municipality}
                            onChange={(e) =>
                                setData(
                                    "project_location_municipality",
                                    e.target.value
                                )
                            }
                            placeholder="Municipality"
                        />
                        {errors.project_location_municipality && (
                            <p className="text-sm text-red-500">
                                {errors.project_location_municipality}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="project_location_province">
                            Province <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="project_location_province"
                            value={data.project_location_province}
                            onChange={(e) =>
                                setData(
                                    "project_location_province",
                                    e.target.value
                                )
                            }
                            placeholder="Province"
                        />
                        {errors.project_location_province && (
                            <p className="text-sm text-red-500">
                                {errors.project_location_province}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="project_area_sqm">
                            Project Area (sqm){" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="project_area_sqm"
                            type="number"
                            step="0.01"
                            value={data.project_area_sqm}
                            onChange={(e) =>
                                setData("project_area_sqm", e.target.value)
                            }
                            placeholder="0.00"
                        />
                        {errors.project_area_sqm && (
                            <p className="text-sm text-red-500">
                                {errors.project_area_sqm}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lot_area_sqm">
                            Lot (sqm) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="lot_area_sqm"
                            type="number"
                            step="0.01"
                            value={data.lot_area_sqm}
                            onChange={(e) =>
                                setData("lot_area_sqm", e.target.value)
                            }
                            placeholder="0.00"
                        />
                        {errors.lot_area_sqm && (
                            <p className="text-sm text-red-500">
                                {errors.lot_area_sqm}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bldg_improvement_sqm">
                            Bldg. Improvement (sqm)
                        </Label>
                        <Input
                            id="bldg_improvement_sqm"
                            type="number"
                            step="0.01"
                            value={data.bldg_improvement_sqm}
                            onChange={(e) =>
                                setData("bldg_improvement_sqm", e.target.value)
                            }
                            placeholder="0.00"
                        />
                        {errors.bldg_improvement_sqm && (
                            <p className="text-sm text-red-500">
                                {errors.bldg_improvement_sqm}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="right_over_land">
                            Right Over Land{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={data.right_over_land}
                            onValueChange={(value) =>
                                setData("right_over_land", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select right over land" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Owner">Owner</SelectItem>
                                <SelectItem value="Lessee">Lessee</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.right_over_land && (
                            <p className="text-sm text-red-500">
                                {errors.right_over_land}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="project_nature_duration">
                            Project Nature{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={data.project_nature_duration}
                            onValueChange={(value) =>
                                setData("project_nature_duration", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Permanent">
                                    Permanent
                                </SelectItem>
                                <SelectItem value="Temporary">
                                    Temporary
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.project_nature_duration && (
                            <p className="text-sm text-red-500">
                                {errors.project_nature_duration}
                            </p>
                        )}
                    </div>

                    {data.project_nature_duration === "Temporary" && (
                        <div className="space-y-2">
                            <Label htmlFor="project_nature_years">
                                Specify Years
                            </Label>
                            <Input
                                id="project_nature_years"
                                type="number"
                                value={data.project_nature_years}
                                onChange={(e) =>
                                    setData(
                                        "project_nature_years",
                                        e.target.value
                                    )
                                }
                                placeholder="Number of years"
                            />
                            {errors.project_nature_years && (
                                <p className="text-sm text-red-500">
                                    {errors.project_nature_years}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="project_cost">
                            Project Cost/Capitalization (in Pesos){" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="project_cost"
                            type="number"
                            step="0.01"
                            value={data.project_cost}
                            onChange={(e) =>
                                setData("project_cost", e.target.value)
                            }
                            placeholder="e.g., 5000000.00"
                        />
                        {errors.project_cost && (
                            <p className="text-sm text-red-500">
                                {errors.project_cost}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="existing_land_use">
                            Existing Land Uses of Project Use{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={data.existing_land_use}
                            onValueChange={(value) =>
                                setData("existing_land_use", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select existing land use" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Residential">
                                    Residential
                                </SelectItem>
                                <SelectItem value="Institutional">
                                    Institutional
                                </SelectItem>
                                <SelectItem value="Commercial">
                                    Commercial
                                </SelectItem>
                                <SelectItem value="Industrial">
                                    Industrial
                                </SelectItem>
                                <SelectItem value="Tenanted">
                                    Tenanted
                                </SelectItem>
                                <SelectItem value="Vacant">Vacant</SelectItem>
                                <SelectItem value="Agricultural">
                                    Agricultural
                                </SelectItem>
                                <SelectItem value="Not Tenanted">
                                    Not Tenanted
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.existing_land_use && (
                            <p className="text-sm text-red-500">
                                {errors.existing_land_use}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Page 3: Land Uses */}
            {currentStep === 3 && (
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <Label className="text-base">
                                Is the project applied for the subject of
                                written notice(s) from this office and/or its
                                zoning administrator to effect requiring for
                                presentation of locational clearance/certificate
                                of zoning compliance (LC/CZC) or to apply for
                                LC/CZC? <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex gap-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="has_written_notice"
                                        value="yes"
                                        checked={
                                            data.has_written_notice === "yes"
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "has_written_notice",
                                                e.target.value
                                            )
                                        }
                                        className="w-4 h-4"
                                    />
                                    <span>Yes</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="has_written_notice"
                                        value="no"
                                        checked={
                                            data.has_written_notice === "no"
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "has_written_notice",
                                                e.target.value
                                            )
                                        }
                                        className="w-4 h-4"
                                    />
                                    <span>No</span>
                                </label>
                            </div>
                            {errors.has_written_notice && (
                                <p className="text-sm text-red-500">
                                    {errors.has_written_notice}
                                </p>
                            )}
                        </div>

                        {data.has_written_notice === "yes" && (
                            <div className="grid gap-4 md:grid-cols-2 pl-6 border-l-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="notice_officer_name">
                                        a) Name of HSRC officer or zoning
                                        administrator who issued the notice(s)
                                    </Label>
                                    <Input
                                        id="notice_officer_name"
                                        value={data.notice_officer_name}
                                        onChange={(e) =>
                                            setData(
                                                "notice_officer_name",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter officer/administrator name"
                                    />
                                    {errors.notice_officer_name && (
                                        <p className="text-sm text-red-500">
                                            {errors.notice_officer_name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="notice_dates">
                                        b) Date(s) of notice(s)
                                    </Label>
                                    <Input
                                        id="notice_dates"
                                        type="date"
                                        value={data.notice_dates}
                                        onChange={(e) =>
                                            setData(
                                                "notice_dates",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {errors.notice_dates && (
                                        <p className="text-sm text-red-500">
                                            {errors.notice_dates}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 border-t pt-4">
                        <div className="space-y-3">
                            <Label className="text-base">
                                Is the project applied for subject of similar
                                application(s) with other offices of the
                                commission and/or deputized zoning
                                administrator?{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex gap-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="has_similar_application"
                                        value="yes"
                                        checked={
                                            data.has_similar_application ===
                                            "yes"
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "has_similar_application",
                                                e.target.value
                                            )
                                        }
                                        className="w-4 h-4"
                                    />
                                    <span>Yes</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="has_similar_application"
                                        value="no"
                                        checked={
                                            data.has_similar_application ===
                                            "no"
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "has_similar_application",
                                                e.target.value
                                            )
                                        }
                                        className="w-4 h-4"
                                    />
                                    <span>No</span>
                                </label>
                            </div>
                            {errors.has_similar_application && (
                                <p className="text-sm text-red-500">
                                    {errors.has_similar_application}
                                </p>
                            )}
                        </div>

                        {data.has_similar_application === "yes" && (
                            <div className="grid gap-4 md:grid-cols-2 pl-6 border-l-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="similar_application_offices">
                                        a) Other HSRC office(s) where similar
                                        application(s) was/were filed
                                    </Label>
                                    <Textarea
                                        id="similar_application_offices"
                                        value={data.similar_application_offices}
                                        onChange={(e) =>
                                            setData(
                                                "similar_application_offices",
                                                e.target.value
                                            )
                                        }
                                        placeholder="List the office(s)"
                                        rows={2}
                                    />
                                    {errors.similar_application_offices && (
                                        <p className="text-sm text-red-500">
                                            {errors.similar_application_offices}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="similar_application_dates">
                                        b) Date(s) filed
                                    </Label>
                                    <Input
                                        id="similar_application_dates"
                                        type="date"
                                        value={data.similar_application_dates}
                                        onChange={(e) =>
                                            setData(
                                                "similar_application_dates",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {errors.similar_application_dates && (
                                        <p className="text-sm text-red-500">
                                            {errors.similar_application_dates}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 border-t pt-4">
                        <div className="space-y-3">
                            <Label className="text-base">
                                Preferred mode of release of decision{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="preferred_release_mode"
                                        value="pickup"
                                        checked={
                                            data.preferred_release_mode ===
                                            "pickup"
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "preferred_release_mode",
                                                e.target.value
                                            )
                                        }
                                        className="w-4 h-4"
                                    />
                                    <span>Pickup</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="preferred_release_mode"
                                        value="mail_applicant"
                                        checked={
                                            data.preferred_release_mode ===
                                            "mail_applicant"
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "preferred_release_mode",
                                                e.target.value
                                            )
                                        }
                                        className="w-4 h-4"
                                    />
                                    <span>By mail, address to Applicant</span>
                                </label>
                                <label className={`flex items-center space-x-2 ${!hasRepresentative ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                    <input
                                        type="radio"
                                        name="preferred_release_mode"
                                        value="mail_representative"
                                        checked={
                                            data.preferred_release_mode ===
                                            "mail_representative"
                                        }
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            // Check if authorized representative exists
                                            if (value === "mail_representative" && !hasRepresentative) {
                                                setNotificationModal({
                                                    isOpen: true,
                                                    type: "warning",
                                                    title: "No Authorized Representative",
                                                    message: "You cannot select 'By mail, address to Authorized Representative' because you have not added an authorized representative in Step 1 (Applicant Information).\n\nPlease either:\n• Go back to Step 1 and add an authorized representative, or\n• Choose a different release mode option.",
                                                    buttonText: "OK, I Understand",
                                                });
                                                return;
                                            }
                                            setData("preferred_release_mode", value);
                                        }}
                                        disabled={!hasRepresentative}
                                        className="w-4 h-4"
                                    />
                                    <span className="flex items-center gap-2">
                                        By mail, address to Authorized
                                        Representative
                                        {!hasRepresentative && (
                                            <span className="text-xs text-amber-600 font-medium">
                                                (No representative added)
                                            </span>
                                        )}
                                    </span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="preferred_release_mode"
                                        value="mail_other"
                                        checked={
                                            data.preferred_release_mode ===
                                            "mail_other"
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "preferred_release_mode",
                                                e.target.value
                                            )
                                        }
                                        className="w-4 h-4"
                                    />
                                    <span>By mail, address to Other</span>
                                </label>
                            </div>
                            {errors.preferred_release_mode && (
                                <p className="text-sm text-red-500">
                                    {errors.preferred_release_mode}
                                </p>
                            )}
                        </div>

                        {data.preferred_release_mode === "mail_other" && (
                            <div className="space-y-2 pl-6 border-l-2">
                                <Label htmlFor="release_address">
                                    Specify address
                                </Label>
                                <Textarea
                                    id="release_address"
                                    value={data.release_address}
                                    onChange={(e) =>
                                        setData(
                                            "release_address",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter mailing address"
                                    rows={2}
                                />
                                {errors.release_address && (
                                    <p className="text-sm text-red-500">
                                        {errors.release_address}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t-2 border-blue-100 mt-8">
                <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-6 py-3 border-2 border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ← Previous
                </Button>

                {currentStep < 3 ? (
                    <Button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg"
                    >
                        Next →
                    </Button>
                ) : (
                    <>
                        {/* Validation Summary - Informational Only */}
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">
                                📋 Form Completion Status
                            </h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`w-2 h-2 rounded-full ${
                                            isStepFilled(1)
                                                ? "bg-green-500"
                                                : "bg-yellow-500"
                                        }`}
                                    ></span>
                                    <span
                                        className={
                                            isStepFilled(1)
                                                ? "text-green-700"
                                                : "text-yellow-700"
                                        }
                                    >
                                        Applicant Information{" "}
                                        {isStepFilled(1)
                                            ? "✓ Complete"
                                            : "⚠ Incomplete"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`w-2 h-2 rounded-full ${
                                            isStepFilled(2)
                                                ? "bg-green-500"
                                                : "bg-yellow-500"
                                        }`}
                                    ></span>
                                    <span
                                        className={
                                            isStepFilled(2)
                                                ? "text-green-700"
                                                : "text-yellow-700"
                                        }
                                    >
                                        Project Details{" "}
                                        {isStepFilled(2)
                                            ? "✓ Complete"
                                            : "⚠ Incomplete"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`w-2 h-2 rounded-full ${
                                            isStepFilled(3)
                                                ? "bg-green-500"
                                                : "bg-yellow-500"
                                        }`}
                                    ></span>
                                    <span
                                        className={
                                            isStepFilled(3)
                                                ? "text-green-700"
                                                : "text-yellow-700"
                                        }
                                    >
                                        Land Use Information{" "}
                                        {isStepFilled(3)
                                            ? "✓ Complete"
                                            : "⚠ Incomplete"}
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-blue-600 mt-2">
                                💡 You can submit anytime, but incomplete
                                sections will be validated before submission
                            </p>
                        </div>

                        <Button
                            type="submit"
                            loading={processing}
                            disabled={processing}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? "Submitting..." : "✓ Submit Request"}
                        </Button>
                    </>
                )}
            </div>

            {/* Confirmation Dialog - Simplified Landscape */}
            <Dialog
                open={isConfirmDialogOpen}
                onOpenChange={setIsConfirmDialogOpen}
            >
                <DialogContent className="max-w-[90vw] w-full bg-white border border-blue-300 rounded-lg overflow-hidden">
                    <DialogHeader className="pb-3 bg-blue-600 text-white p-4 -m-6 mb-4 rounded-t-lg">
                        <DialogTitle className="text-lg font-bold text-white">
                            Confirm Application Submission
                        </DialogTitle>
                        <DialogDescription className="text-sm text-white">
                            Please review your application details before
                            submitting.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Content Grid - Compact 2 Column Layout */}
                    <div className="grid grid-cols-2 gap-4 py-2 overflow-y-auto max-h-[calc(85vh-200px)]">
                        {/* Left Column */}
                        <div className="space-y-3">
                            {/* Applicant Information */}
                            <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                                <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5 text-blue-600" />
                                    Applicant Information
                                </h3>
                                <div className="space-y-2 text-xs">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-[10px] font-medium text-gray-500">
                                                Applicant Name
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {data.applicant_name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-medium text-gray-500">
                                                Applicant Address
                                            </p>
                                            <p className="font-medium text-gray-900">
                                                {data.applicant_address}
                                            </p>
                                        </div>
                                    </div>
                                    {data.corporation_name && (
                                        <>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">
                                                    Corporation Name
                                                </p>
                                                <p className="font-semibold">
                                                    {data.corporation_name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">
                                                    Corporation Address
                                                </p>
                                                <p className="font-medium">
                                                    {data.corporation_address ||
                                                        "N/A"}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                    {hasRepresentative &&
                                        data.authorized_representative_name && (
                                            <>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500">
                                                        Authorized
                                                        Representative
                                                    </p>
                                                    <p className="font-semibold">
                                                        {
                                                            data.authorized_representative_name
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500">
                                                        Representative Address
                                                    </p>
                                                    <p className="font-medium">
                                                        {data.authorized_representative_address ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                                {data.authorization_letter && (
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500">
                                                            Authorization Letter
                                                        </p>
                                                        <p className="font-medium flex items-center gap-1">
                                                            <FileText className="h-3 w-3 text-gray-600" />
                                                            {
                                                                data
                                                                    .authorization_letter
                                                                    .name
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                </div>
                            </div>

                            {/* Project Details */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-purple-600" />
                                    Project Details
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">
                                                Project Type
                                            </p>
                                            <p className="font-semibold">
                                                {data.project_type}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">
                                                Project Nature
                                            </p>
                                            <p className="font-semibold">
                                                {data.project_nature}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">
                                                Project Duration
                                            </p>
                                            <p className="font-semibold">
                                                {data.project_nature_duration}
                                                {data.project_nature_years &&
                                                    ` (${data.project_nature_years} years)`}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">
                                                Right Over Land
                                            </p>
                                            <p className="font-semibold">
                                                {data.right_over_land}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">
                                                Project Area
                                            </p>
                                            <p className="font-semibold">
                                                {parseFloat(
                                                    data.project_area_sqm
                                                ).toLocaleString()}{" "}
                                                sqm
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">
                                                Lot Area
                                            </p>
                                            <p className="font-semibold">
                                                {parseFloat(
                                                    data.lot_area_sqm
                                                ).toLocaleString()}{" "}
                                                sqm
                                            </p>
                                        </div>
                                        {data.bldg_improvement_sqm && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">
                                                    Building Area
                                                </p>
                                                <p className="font-semibold">
                                                    {parseFloat(
                                                        data.bldg_improvement_sqm
                                                    ).toLocaleString()}{" "}
                                                    sqm
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">
                                            Project Cost
                                        </p>
                                        <p className="font-semibold">
                                            ₱
                                            {parseFloat(
                                                data.project_cost
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6 overflow-y-auto pr-2">
                            {/* Project Location */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-green-600" />
                                    Project Location
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="grid grid-cols-2 gap-3">
                                        {data.project_location_number && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">
                                                    House/Lot Number
                                                </p>
                                                <p className="font-semibold">
                                                    {
                                                        data.project_location_number
                                                    }
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">
                                                Street
                                            </p>
                                            <p className="font-semibold">
                                                {data.project_location_street}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">
                                                Barangay
                                            </p>
                                            <p className="font-semibold">
                                                {data.project_location_barangay}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">
                                                Municipality/City
                                            </p>
                                            <p className="font-semibold">
                                                {
                                                    data.project_location_municipality
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">
                                                Province
                                            </p>
                                            <p className="font-semibold">
                                                {data.project_location_province}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Land Use Information */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Home className="h-4 w-4 text-amber-600" />
                                    Land Use Information
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">
                                                Existing Land Use
                                            </p>
                                            <p className="font-semibold">
                                                {data.existing_land_use}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">
                                                Written Notice to Tenants
                                            </p>
                                            <p className="font-semibold">
                                                {data.has_written_notice ===
                                                "yes"
                                                    ? "Yes"
                                                    : "No"}
                                            </p>
                                        </div>
                                    </div>

                                    {data.has_written_notice === "yes" && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">
                                                    Notice Officer Name
                                                </p>
                                                <p className="font-semibold">
                                                    {data.notice_officer_name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">
                                                    Notice Dates
                                                </p>
                                                <p className="font-semibold">
                                                    {data.notice_dates}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">
                                                Similar Application Filed
                                            </p>
                                            <p className="font-semibold">
                                                {data.has_similar_application ===
                                                "yes"
                                                    ? "Yes"
                                                    : "No"}
                                            </p>
                                        </div>
                                    </div>

                                    {data.has_similar_application === "yes" && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">
                                                    Application Offices
                                                </p>
                                                <p className="font-semibold">
                                                    {
                                                        data.similar_application_offices
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">
                                                    Application Dates
                                                </p>
                                                <p className="font-semibold">
                                                    {
                                                        data.similar_application_dates
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Release Preference */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-teal-600" />
                                    Release Preference
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">
                                            Preferred Release Mode
                                        </p>
                                        <p className="font-semibold capitalize">
                                            {data.preferred_release_mode.replace(
                                                "_",
                                                " "
                                            )}
                                        </p>
                                    </div>
                                    {data.preferred_release_mode === "mail" &&
                                        data.release_address && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">
                                                    Release Address
                                                </p>
                                                <p className="font-semibold">
                                                    {data.release_address}
                                                </p>
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* Important Note */}
                            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-blue-900 mb-1 text-sm">
                                            Important Notice
                                        </p>
                                        <p className="text-xs text-blue-800">
                                            Once submitted, you will receive a
                                            confirmation email. Your application
                                            will be reviewed by our admin team.
                                            Please ensure all information is
                                            accurate before confirming.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t bg-gray-50 p-4 -m-4 mt-4">
                        <DialogFooter>
                            <div className="flex justify-end gap-3 w-full">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setIsConfirmDialogOpen(false)
                                    }
                                    disabled={processing}
                                    className="px-6 py-2 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-medium text-gray-700 rounded-lg"
                                >
                                    Review Again
                                </Button>
                                <Button
                                    onClick={confirmSubmit}
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50"
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            Submitting...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Confirm & Submit
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
            {/* Notification Modal */}
            <NotificationModal
                isOpen={notificationModal.isOpen}
                onClose={() =>
                    setNotificationModal((prev) => ({ ...prev, isOpen: false }))
                }
                type={notificationModal.type}
                title={notificationModal.title}
                message={notificationModal.message}
                buttonText={notificationModal.buttonText}
            />
        </form>
    );
}
