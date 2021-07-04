import React from 'react';

export default function Form() {
  return (
    <>
      <form>

        <div class="form-group">
          <h5>Name</h5>
          <label class="mdc-text-field mdc-text-field--outlined mdc-text-field--no-label">
            <span class="mdc-notched-outline">
              <span class="mdc-notched-outline__leading"></span>
              <span class="mdc-notched-outline__trailing"></span>
            </span>
            <input name="name" class="mdc-text-field__input" type="text" aria-label="Label"/>
          </label>
        </div>
        <br/>

        <div class="form-group">
          <h5>Description</h5>
          <label class="mdc-text-field mdc-text-field--outlined mdc-text-field--textarea mdc-text-field--no-label">
            <span class="mdc-notched-outline">
              <span class="mdc-notched-outline__leading"></span>
              <span class="mdc-notched-outline__trailing"></span>
            </span>
            <span class="mdc-text-field__resizer">
              <textarea name="description" class="mdc-text-field__input" rows="8" cols="40" aria-label="Label"></textarea>
            </span>
          </label>
        </div>
        <br/>
        
        <div class="form-group">
          <h5>Your contact details:</h5>
          <label class="mdc-text-field mdc-text-field--outlined mdc-text-field--no-label">
            <span class="mdc-notched-outline">
              <span class="mdc-notched-outline__leading"></span>
              <span class="mdc-notched-outline__trailing"></span>
            </span>
            <input name="contact_details" class="mdc-text-field__input" type="text" name="contact_details" id="contact_details"/>
          </label>
        </div>

        <br/>
        <br/>

      </form>
      
      <button id="location-btn" class="mdc-button mdc-button--raised general">
        Add your Location
      </button>
      <br/>
      <div id="form-map">MAP</div>
      <br/>

      <button id="submit-btn" class="mdc-button mdc-button--raised general">
        Report Crime
      </button>
    
      <br/><br/><br/>
    </>
  )
}