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
        Schema::create('roadmap_steps', function (Blueprint $table) {
            $table->id();
    
            $table->foreignId('roadmap_id')
                ->constrained()
                ->cascadeOnDelete();
    
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('topics')->nullable();
            $table->unsignedInteger('step_order');
            $table->string('duration')->nullable();
    
            $table->timestamps();
    
            $table->unique(['roadmap_id', 'step_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roadmap_steps');
    }
};
