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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('category');
            $table->string('level')->default('Beginner');
            $table->decimal('price', 10, 2)->default(0);
            $table->string('duration')->nullable();
            $table->string('image')->nullable();
            $table->string('instructor')->nullable();
            $table->decimal('rating', 2, 1)->default(0);
            $table->unsignedInteger('students_count')->default(0);
            $table->json('what_you_learn')->nullable();
            $table->json('curriculum')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
