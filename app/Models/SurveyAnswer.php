<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyAnswer extends Model {
    use HasFactory;

    protected $fillable = [
        'user_id',
        'option_id'];

    protected $hidden = ['updated_at'];

    public function Survey() {
        return $this->belongsTo(Survey::class);
    }
}
