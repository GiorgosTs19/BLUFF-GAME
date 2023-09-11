<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('survey_options', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('survey_id');
            $table->boolean('enabled')->default(true);
            $table->text('text');
            $table->text('attachment_type');
            $table->string('attachment');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('survey_options');
    }
};
