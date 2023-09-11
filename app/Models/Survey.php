<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Survey extends Model {
    use HasFactory;

    protected $fillable = [
        'creator',
        'name',
        'location',
        'active',
        'result'];

    public function Options(): \Illuminate\Database\Eloquent\Relations\HasMany {
        return $this->hasMany(SurveyOption::class);
    }

    public function Answers(): \Illuminate\Database\Eloquent\Relations\HasMany {
        return $this->hasMany(SurveyAnswer::class);
    }

    public function Result() {
        return $this->result;
    }

    public function Close() {
        $this->active = false;
        $Answers = $this->Answers()->get('id');
        $this->save();
    }

    public function Open() {
        $this->active = true;
        $this->save();
    }
}
