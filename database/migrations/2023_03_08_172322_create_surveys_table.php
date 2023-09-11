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
        Schema::create('surveys', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('creator');
            $table->string('name');
            $table->string('location');
            $table->boolean('active')->default(true);
            $table->foreignUuid('result')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('surveys');
    }
};
