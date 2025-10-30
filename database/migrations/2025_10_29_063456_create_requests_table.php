<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            
            // Page 1: Applicant Information
            $table->string('applicant_name');
            $table->string('corporation_name')->nullable();
            $table->text('applicant_address');
            $table->text('corporation_address')->nullable();
            $table->string('authorized_representative_name')->nullable();
            $table->text('authorized_representative_address')->nullable();
            
            // Page 2: Project Details
            $table->string('project_type');
            $table->string('project_nature');
            $table->string('project_location_number')->nullable();
            $table->string('project_location_street')->nullable();
            $table->string('project_location_barangay')->nullable();
            $table->string('project_location_city')->nullable();
            $table->string('project_location_municipality')->nullable();
            $table->string('project_location_province')->nullable();
            $table->decimal('project_area_sqm', 10, 2)->nullable();
            $table->decimal('lot_area_sqm', 10, 2)->nullable();
            $table->decimal('bldg_improvement_sqm', 10, 2)->nullable();
            $table->enum('right_over_land', ['Owner', 'Lessee'])->nullable();
            $table->enum('project_nature_duration', ['Permanent', 'Temporary'])->nullable();
            $table->integer('project_nature_years')->nullable();
            $table->text('project_cost')->nullable();
            
            // Page 3: Land Uses
            $table->enum('existing_land_use', [
                'Residential', 'Institutional', 'Commercial', 'Industrial', 
                'Tenanted', 'Vacant', 'Agricultural', 'Not Tenanted'
            ])->nullable();
            $table->enum('has_written_notice', ['yes', 'no'])->nullable();
            $table->string('notice_officer_name')->nullable();
            $table->string('notice_dates')->nullable();
            $table->enum('has_similar_application', ['yes', 'no'])->nullable();
            $table->text('similar_application_offices')->nullable();
            $table->string('similar_application_dates')->nullable();
            $table->enum('preferred_release_mode', [
                'pickup', 'mail_applicant', 'mail_representative', 'mail_other'
            ])->nullable();
            $table->text('release_address')->nullable();
            
            // Status and metadata
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->unsignedInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
