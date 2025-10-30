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
import { useToast } from "@/Components/ui/use-toast";
import { Check } from "lucide-react";

export default function RequestForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [hasRepresentative, setHasRepresentative] = useState(false);
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
            applicant_name: "Applicant Name",
            applicant_address: "Applicant Address",
        };

        const emptyFields = [];
        
        for (const [field, label] of Object.entries(requiredFields)) {
            if (!data[field] || data[field].trim() === '') {
                emptyFields.push(label);
            }
        }

        if (emptyFields.length > 0) {
            toast({
                variant: "destructive",
                title: "Required Fields Missing",
                description: `Please fill in the following required fields: ${emptyFields.join(', ')}`,
                duration: 5000,
            });
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        post(route("request.store"), {
            preserveScroll: true,
            onSuccess: (page) => {
                const successMessage = page.props.flash?.success || "Request submitted successfully!";
                toast({
                    title: "Success!",
                    description: successMessage,
                    duration: 5000,
                });
                reset();
                setCurrentStep(1);
                setCompletedSteps([]);
            },
            onError: () => {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "There was an error submitting your request. Please check the form and try again.",
                    duration: 5000,
                });
            }
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

    const isStepFilled = (step) => {
        if (step === 1) {
            // Check if required fields are filled
            return data.applicant_name && 
                   data.applicant_name.trim() !== '' && 
                   data.applicant_address && 
                   data.applicant_address.trim() !== '';
        } else if (step === 2) {
            // Check if at least some project details are filled
            return data.project_type || 
                   data.project_nature || 
                   data.project_location_street || 
                   data.project_location_barangay ||
                   data.lot_area_sqm ||
                   data.project_cost;
        } else if (step === 3) {
            // Check if at least some land use info is filled
            return data.has_written_notice || 
                   data.has_similar_application || 
                   data.preferred_release_mode;
        }
        return false;
    };

    const nextStep = (e) => {
        e.preventDefault();
        if (currentStep < 3) {
            // Mark current step as completed if filled
            if (isStepFilled(currentStep) && !completedSteps.includes(currentStep)) {
                setCompletedSteps([...completedSteps, currentStep]);
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
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentStep(1)}>
                    <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all hover:scale-110 ${
                            currentStep >= 1
                                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md"
                                : "bg-gray-200 text-gray-500"
                        }`}
                    >
                        {completedSteps.includes(1) ? <Check className="h-6 w-6" /> : "1"}
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
                            currentStep >= 2 ? "bg-gradient-to-r from-blue-600 to-blue-700" : "bg-gray-200"
                        }`}
                        style={{ width: currentStep >= 2 ? "100%" : "0%" }}
                    ></div>
                </div>
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentStep(2)}>
                    <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all hover:scale-110 ${
                            currentStep >= 2
                                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md"
                                : "bg-gray-200 text-gray-500"
                        }`}
                    >
                        {completedSteps.includes(2) ? <Check className="h-6 w-6" /> : "2"}
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
                            currentStep >= 3 ? "bg-gradient-to-r from-blue-600 to-blue-700" : "bg-gray-200"
                        }`}
                        style={{ width: currentStep >= 3 ? "100%" : "0%" }}
                    ></div>
                </div>
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentStep(3)}>
                    <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all hover:scale-110 ${
                            currentStep >= 3
                                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md"
                                : "bg-gray-200 text-gray-500"
                        }`}
                    >
                        {completedSteps.includes(3) ? <Check className="h-6 w-6" /> : "3"}
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
                            Name of Applicant <span className="text-red-500">*</span>
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
                            Address of Applicant <span className="text-red-500">*</span>
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
                                        setData("authorized_representative_name", "");
                                        setData("authorized_representative_address", "");
                                        setData("authorization_letter", null);
                                    }
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="has_representative" className="font-medium cursor-pointer">
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
                                        Please fill in the representative details and upload the authorization letter.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="authorized_representative_name">
                                    Name of Authorized Representative <span className="text-red-500">*</span>
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
                                <Label htmlFor="authorization_letter">
                                    Authorization Letter <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="authorization_letter"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) =>
                                        setData("authorization_letter", e.target.files[0])
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
                                    Address of Authorized Representative <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="authorized_representative_address"
                                    value={data.authorized_representative_address}
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
                                        {errors.authorized_representative_address}
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
                        <Label htmlFor="project_type">Project Type</Label>
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
                        <Label htmlFor="project_nature">Project Nature</Label>
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
                        <Label htmlFor="project_location_street">Street</Label>
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
                            Barangay
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
                            Municipality
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
                            Province
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
                            Project Area (sqm)
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
                        <Label htmlFor="lot_area_sqm">Lot (sqm)</Label>
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
                        <Label htmlFor="right_over_land">Right Over Land</Label>
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
                            Project Nature
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
                            Project Cost/Capitalization (in Pesos)
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
                            Existing Land Uses of Project Use
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
                                LC/CZC?
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
                                        value={data.notice_dates}
                                        onChange={(e) =>
                                            setData(
                                                "notice_dates",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., January 15, 2025"
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
                                administrator?
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
                                        value={data.similar_application_dates}
                                        onChange={(e) =>
                                            setData(
                                                "similar_application_dates",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., January 15, 2025"
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
                                Preferred mode of release of decision
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
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="preferred_release_mode"
                                        value="mail_representative"
                                        checked={
                                            data.preferred_release_mode ===
                                            "mail_representative"
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "preferred_release_mode",
                                                e.target.value
                                            )
                                        }
                                        className="w-4 h-4"
                                    />
                                    <span>
                                        By mail, address to Authorized
                                        Representative
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
                    <Button 
                        type="submit" 
                        disabled={processing}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? "Submitting..." : "✓ Submit Request"}
                    </Button>
                )}
            </div>
        </form>
    );
}
