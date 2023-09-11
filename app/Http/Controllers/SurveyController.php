<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use Illuminate\Http\Request;

class SurveyController extends Controller {
    public function createSurvey(Request $request) {
        $input = $request->only(['name','location','options']);
        $Survey = new Survey;
        $Survey->name = $input['name'];
        $Survey->location = $input['location'];
        $Survey->creator = $request->user()->id;
        $Survey->save();
    }

    public function ChangeSurveyStatus(Request $request) {
        $input = $request->only(['survey_id','status']);
        $Survey = Survey::find($input['survey_id']);
        switch ($input['status']) {
            case 'Open' : {
                $Survey->Open();
                break;
            }
            case 'Close' : {
                $Survey->Close();
                break;
            }
        }
    }
}
