<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('course_progress', function (Blueprint $table) {

            if (!Schema::hasColumn('course_progress', 'enrollment_id')) {
                $table->unsignedBigInteger('enrollment_id')->nullable();
            }

            if (!Schema::hasColumn('course_progress', 'progress_percentage')) {
                $table->integer('progress_percentage')->default(0);
            }

            if (!Schema::hasColumn('course_progress', 'started_at')) {
                $table->timestamp('started_at')->nullable();
            }

            if (!Schema::hasColumn('course_progress', 'completed_at')) {
                $table->timestamp('completed_at')->nullable();
            }

        });
    }

    public function down(): void
    {
        Schema::table('course_progress', function (Blueprint $table) {

            if (Schema::hasColumn('course_progress', 'completed_at')) {
                $table->dropColumn('completed_at');
            }

            if (Schema::hasColumn('course_progress', 'started_at')) {
                $table->dropColumn('started_at');
            }

            if (Schema::hasColumn('course_progress', 'progress_percentage')) {
                $table->dropColumn('progress_percentage');
            }

            if (Schema::hasColumn('course_progress', 'enrollment_id')) {
                $table->dropColumn('enrollment_id');
            }

        });
    }
};