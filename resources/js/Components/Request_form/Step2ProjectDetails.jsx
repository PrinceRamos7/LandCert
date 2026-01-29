import React from "react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export function Step2ProjectDetails({ data, errors, onDataChange }) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="project_type">
                    Project Type <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="project_type"
                    value={data.project_type}
                    onChange={(e) => onDataChange("project_type", e.target.value)}
                    placeholder="Enter project type"
                />
                {errors.project_type && (
                    <p className="text-sm text-red-500">{errors.project_type}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="project_nature">
                    Project Nature <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="project_nature"
                    value={data.project_nature}
                    onChange={(e) => onDataChange("project_nature", e.target.value)}
                    placeholder="Enter project nature"
                />
                {errors.project_nature && (
                    <p className="text-sm text-red-500">{errors.project_nature}</p>
                )}
            </div>

            <div className="space-y-2 md:col-span-2">
                <Label className="text-base font-semibold">Project Location</Label>
            </div>

            <div className="space-y-2">
                <Label htmlFor="project_location_number">Number</Label>
                <Input
                    id="project_location_number"
                    value={data.project_location_number}
                    onChange={(e) =>
                        onDataChange("project_location_number", e.target.value)
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
                        onDataChange("project_location_street", e.target.value)
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
                        onDataChange("project_location_barangay", e.target.value)
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
                        onDataChange("project_location_municipality", e.target.value)
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
                        onDataChange("project_location_province", e.target.value)
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
                    Project Area (sqm) <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="project_area_sqm"
                    type="number"
                    step="0.01"
                    value={data.project_area_sqm}
                    onChange={(e) => onDataChange("project_area_sqm", e.target.value)}
                    placeholder="0.00"
                />
                {errors.project_area_sqm && (
                    <p className="text-sm text-red-500">{errors.project_area_sqm}</p>
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
                    onChange={(e) => onDataChange("lot_area_sqm", e.target.value)}
                    placeholder="0.00"
                />
                {errors.lot_area_sqm && (
                    <p className="text-sm text-red-500">{errors.lot_area_sqm}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="bldg_improvement_sqm">Bldg. Improvement (sqm)</Label>
                <Input
                    id="bldg_improvement_sqm"
                    type="number"
                    step="0.01"
                    value={data.bldg_improvement_sqm}
                    onChange={(e) => onDataChange("bldg_improvement_sqm", e.target.value)}
                    placeholder="0.00"
                />
                {errors.bldg_improvement_sqm && (
                    <p className="text-sm text-red-500">{errors.bldg_improvement_sqm}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="right_over_land">
                    Right Over Land <span className="text-red-500">*</span>
                </Label>
                <Select
                    value={data.right_over_land}
                    onValueChange={(value) => onDataChange("right_over_land", value)}
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
                    <p className="text-sm text-red-500">{errors.right_over_land}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="project_nature_duration">
                    Project Nature <span className="text-red-500">*</span>
                </Label>
                <Select
                    value={data.project_nature_duration}
                    onValueChange={(value) =>
                        onDataChange("project_nature_duration", value)
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Permanent">Permanent</SelectItem>
                        <SelectItem value="Temporary">Temporary</SelectItem>
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
                    <Label htmlFor="project_nature_years">Specify Years</Label>
                    <Input
                        id="project_nature_years"
                        type="number"
                        value={data.project_nature_years}
                        onChange={(e) =>
                            onDataChange("project_nature_years", e.target.value)
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
                    onChange={(e) => onDataChange("project_cost", e.target.value)}
                    placeholder="e.g., 5000000.00"
                />
                {errors.project_cost && (
                    <p className="text-sm text-red-500">{errors.project_cost}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="existing_land_use">
                    Existing Land Uses of Project Use{" "}
                    <span className="text-red-500">*</span>
                </Label>
                <Select
                    value={data.existing_land_use}
                    onValueChange={(value) => onDataChange("existing_land_use", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select existing land use" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Residential">Residential</SelectItem>
                        <SelectItem value="Institutional">Institutional</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                        <SelectItem value="Tenanted">Tenanted</SelectItem>
                        <SelectItem value="Vacant">Vacant</SelectItem>
                        <SelectItem value="Agricultural">Agricultural</SelectItem>
                        <SelectItem value="Not Tenanted">Not Tenanted</SelectItem>
                    </SelectContent>
                </Select>
                {errors.existing_land_use && (
                    <p className="text-sm text-red-500">{errors.existing_land_use}</p>
                )}
            </div>
        </div>
    );
}
