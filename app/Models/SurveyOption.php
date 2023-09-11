<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyOption extends Model {
    use HasFactory;

    protected $fillable = [
        'text',
        'attachment_type',
        'attachment'
    ];

    public function Survey() {
        return $this->belongsTo(Survey::class);
    }

    public function Answers() {
        return $this->hasMany(SurveyAnswer::class);
    }
}
