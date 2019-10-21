<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    xmlns:java-string="java:java.lang.String"
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
    xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
    xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
    xmlns:dd="DynamicDocumentation"
    exclude-result-prefixes="xsl xs fn n doc cdocfx java-string xr-date-formatter">
    
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    
    <xsl:param as="xs:string" name="current-locale" select="'en_US'"/>
    
    <!-- Backend system locale passed as a paramter -->
    <xsl:param as="xs:string" name="SystemLocale" select="''"/>
    
    <!-- Required to include CommonFxn.xslt -->
    <!-- Comment out this line to debug --> <xsl:include href="/cernerbasiccontent/formats/dxcommonfxn.xslt"/>
    <!-- Uncomment this line to debug <xsl:include href="DXCommonFxn.xslt"/> -->
    <!-- Comment out this line to debug --> <xsl:include href="/cernerbasiccontent/formats/medsadmincommon.xslt"/>
    <!-- Uncomment this line to debug <xsl:include href="MedsAdminCommon.xslt"/> -->
    
    <xsl:variable name="Separator" as="xs:string"> <!-- Seperator between detail components -->
        <xsl:value-of select="', %s'"/>
    </xsl:variable>
    <xsl:variable name="Connect" as="xs:string"> <!-- Connect two strings as one with a space in between -->
        <xsl:value-of select="'%s %s'"/>
    </xsl:variable>
    <xsl:variable name="Given" as="xs:string"> <!-- Label for Given Meds and Immunizations grouper -->
        <xsl:value-of select="'Given'"/>
    </xsl:variable>
    <xsl:variable name="NotGiven" as="xs:string"> <!-- Label for Not Given Immunizations grouper -->
        <xsl:value-of select="'Not Given'"/>
    </xsl:variable>
    <xsl:variable name="Period" as="xs:string">	<!-- Seperator between med order and diagnoses -->
        <xsl:value-of select="'. %s'"/>
    </xsl:variable>
    <xsl:variable name="For" as="xs:string"> <!-- Label for indicating Diagnoses -->
        <xsl:value-of select="'For: '"/>
    </xsl:variable>
    <xsl:variable name="medsAdminOrderIdsList" as="element()*"> <!-- List of Medication Order-Ids in Meds Admin Node -->
        <xsl:copy-of select="cdocfx:getMedsAdminOrderIdList(n:report/n:clinical-data/n:medication-administration-data)"/>
    </xsl:variable>
    
    <xsl:template match="n:report">
        
        <xsl:variable name="medAdminData" select="n:clinical-data/n:medication-administration-data"/>
        
        <!-- When the medication-administration-data list is present in the report, we should filter to only 
           medications that exist in medication-administration-data lists that are "given" -->
        <xsl:variable name="givenContinuousMedAdmins" 
            select="$medAdminData/n:continuous-medication-administration[count(n:not-given-reason) = 0]"/>
        <xsl:variable name="givenNonContinuousMedAdmins" 
            select="$medAdminData/n:non-continuous-medication-administration[count(n:not-given-reason) = 0]"/>
        
        <!-- Get the medication orders corresponding to given continuous medication administration data -->
        <xsl:variable name="givenContinuousMedAdminOrders" 
            select="n:clinical-data/n:order-data/n:medication-order[(@order-id = $givenContinuousMedAdmins/n:order/@order-id) or
            (@order-id = $givenContinuousMedAdmins/n:order/@template-order-id)]"/>
   
        <!-- Get the medication orders corresponding to given non-continuous medication administration data -->
        <xsl:variable name="givenNonContinuousMedAdminOrders" 
            select="n:clinical-data/n:order-data/n:medication-order[(@order-id = $givenNonContinuousMedAdmins/n:order/@order-id) or
            (@order-id = $givenNonContinuousMedAdmins/n:order/@template-order-id)]"/>
        
        <!-- Get all diagnosis -->
        <xsl:variable name="diagnoses" select="n:clinical-data/n:diagnosis-data"/>
        
        <!-- Get all immunizations -->
        <xsl:variable name="immunizations" select="n:clinical-data/n:immunizationV2-data"/>

        <xsl:call-template name="DisplayMedsAdminContent">
            <xsl:with-param name="givenContinuousMedAdmins" select="$givenContinuousMedAdmins"/>
            <xsl:with-param name="givenContinuousMedAdminOrders" select="$givenContinuousMedAdminOrders"/>
            <xsl:with-param name="givenNonContinuousMedAdmins" select="$givenNonContinuousMedAdmins"/>
            <xsl:with-param name="givenNonContinuousMedAdminOrders" select="$givenNonContinuousMedAdminOrders"/>
            <xsl:with-param name="immunizations" select="$immunizations"/>
            <xsl:with-param name="diagnoses" select="$diagnoses"/>
        </xsl:call-template>
    </xsl:template>
    
    <!-- Format to display medications and immunizations administered as ddemrcontentitem -->
    <xsl:template name="DisplayMedsAdminContent">
        <xsl:param name="givenContinuousMedAdmins"/>
        <xsl:param name="givenContinuousMedAdminOrders"/>
        <xsl:param name="givenNonContinuousMedAdmins"/>
        <xsl:param name="givenNonContinuousMedAdminOrders"/>
        <xsl:param name="immunizations"/>
        <xsl:param name="diagnoses"/>
       
        <!-- Build XML containing given and not-given immunizations, recorded immunizations are omitted -->
        <xsl:variable name="Immunizations">
            
            <xsl:if test="$immunizations/n:given">
                <xsl:for-each select="$immunizations/n:given[@is-uncharted = 'false'] ">
                <!-- Immunizations variable contains information such as comments,event-display etc
                     about all given and not given immunizations. -->
                <!-- Avoid displaying immunizations already displayed as administered meds. -->
                    <xsl:if test="cdocfx:shouldDisplayImmunization(.,$medsAdminOrderIdsList)">
                    <immunization status="given">
                        <xsl:attribute name="event-id">
                            <xsl:if test="@event-id">	
                                <xsl:value-of select="@event-id"/>
                            </xsl:if>	
                        </xsl:attribute>
                        <xsl:attribute name="event-display">
                            <xsl:if test="n:vaccine/n:event-type/@event-display">	
                                <xsl:value-of select="n:vaccine/n:event-type/@event-display"/>
                            </xsl:if>	
                        </xsl:attribute>
                        <xsl:attribute name="route">
                            <xsl:if test="@admin-route-code">	
                                <xsl:variable name="sRouteAdministration" as="xs:string" select="cdocfx:getCodeDisplayByID(@admin-route-code)"/>
                                <xsl:value-of select="$sRouteAdministration"/>
                            </xsl:if>	
                        </xsl:attribute> 
                        <xsl:for-each select="n:comment">
                            <comment>
                                <xsl:value-of select="n:comment"/>
                            </comment>
                        </xsl:for-each>
                    </immunization>
                  </xsl:if>
                </xsl:for-each>
            </xsl:if>
            
            <xsl:if test="$immunizations/n:not-given">
                <xsl:for-each select="$immunizations/n:not-given">
                    <immunization status="not-given">
                        <xsl:attribute name="event-id">
                            <xsl:if test="@event-id">	
                                <xsl:value-of select="@event-id"/>
                            </xsl:if>	
                        </xsl:attribute>
                        <xsl:attribute name="event-display">
                            <xsl:if test="n:vaccine/n:event-type/@event-display">	
                                <xsl:value-of select="n:vaccine/n:event-type/@event-display"/>
                            </xsl:if>	
                        </xsl:attribute>
                        <xsl:attribute name="not-given-reason">
                            <xsl:if test="@reason-code">	
                                <xsl:value-of select="cdocfx:getCodeDisplayByID(@reason-code)"/>
                            </xsl:if>	
                        </xsl:attribute>
                        <xsl:for-each select="n:comment">
                            <comment>
                                <xsl:value-of select="n:comment"/>
                            </comment>
                        </xsl:for-each>
                    </immunization>
                </xsl:for-each>
            </xsl:if> 
            
        </xsl:variable>
        
        <!-- Display Medications Administered and Given Immunizations as part of "Given" grouper -->
        <xsl:if test="count($givenContinuousMedAdminOrders)&gt;= 1 or count($givenNonContinuousMedAdmins)&gt;= 1 or $immunizations/n:given">
            <div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
                <span style="font-size:13pt;font-weight: bold;">
                    <xsl:value-of select="$Given"/>
                </span>
                
                <!-- Display Medications Administered -->
                
                <!-- Display Continuous Medications Administered -->
                <!-- For continuous medications administered, 
                     Display clinical name and dose from original order. 
                        •	If it’s a single ingredient, we display clinical name name and dose from original order
                        •	If it’s a multi ingredient, we just use the clinical-name from original order which will 
                            already have pre-built  dose information (ex: “Lactated Ringers Injection 1000 mL + Cod Liver Oil Mint 1 mL”)

                        For choosing dose, we use the following hierarchy from original order: strength, volume and then free text
                -->
                <xsl:call-template name="DisplayContinuousMedAdmins">
                    <xsl:with-param name="givenContinuousMedAdmins" select="$givenContinuousMedAdmins"/>
                    <xsl:with-param name="givenContinuousMedAdminOrders" select="$givenContinuousMedAdminOrders"/>
                    <xsl:with-param name="diagnoses" select="$diagnoses"/>
                </xsl:call-template>
                
                <!-- Display Non Continuous Medications Administered -->
                <!-- For non-continuous medications administered, 
                     Display clinical name and dose from when it was administered. 
                        •	If it’s a single ingredient, we display clinical name and dose from when it was administered.
                        •	If it’s a multi ingredient, we build out the clinical name and dose ourselves in the following format:
                                clinical name, dose + clinical name, dose + clinical name, dose.. etc
 
                     For choosing dose, we use the following hierarchy from medication ingredient when it was administered: dose, initial-dose, volume, initial-volume
                -->
                <xsl:call-template name="DisplayNonContinuousMedAdmins">
                    <xsl:with-param name="givenNonContinuousMedAdmins" select="$givenNonContinuousMedAdmins"/>
                    <xsl:with-param name="givenNonContinuousMedAdminOrders" select="$givenNonContinuousMedAdminOrders"/>
                    <xsl:with-param name="diagnoses" select="$diagnoses"/>
                </xsl:call-template>
                
                <!-- Display "Given" Immunizations -->
                <xsl:for-each select="$Immunizations/immunization[@status='given']">          
                    <xsl:sort select="fn:upper-case(@event-display)" order="ascending"/>
                    <xsl:call-template name="DisplayImmunization">
                        <xsl:with-param name="Immunization" select="."/>
                    </xsl:call-template>
                </xsl:for-each>
            </div>
        </xsl:if>
        
        <!-- Display "Not Given" Immunizations as part of "Not Given" grouper -->
        <xsl:if test="$immunizations/n:not-given">
            <div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
                <span style="font-size:13pt;font-weight: bold;">
                    <xsl:value-of select="$NotGiven"/>
                </span>
                
                <xsl:for-each select="$Immunizations/immunization[@status='not-given']">
                    <xsl:sort select="fn:upper-case(@event-display)" order="ascending"/>
                    <xsl:call-template name="DisplayImmunization">
                        <xsl:with-param name="Immunization" select="."/>
                    </xsl:call-template>
                </xsl:for-each>
            </div>
        </xsl:if>
    </xsl:template>
    
    <xsl:template name="DisplayContinuousMedAdmins">
        <xsl:param name="givenContinuousMedAdmins"/>
        <xsl:param name="givenContinuousMedAdminOrders"/>
        <xsl:param name="diagnoses"/>
        
        <!-- Sort medication order types by @clinical-name ascending -->
        <xsl:for-each select="$givenContinuousMedAdminOrders">
            <xsl:sort select="fn:upper-case(@clinical-name)" order="ascending"/>
            <div class="ddemrcontentitem ddremovable" style="margin-left: 1em; padding-left:1em; text-indent:-1em;">
                <xsl:variable name="orderId" select="@order-id"/>
                <!-- Use first encountered continuous med admin instance event-id as entity id -->
                <xsl:attribute name="dd:entityid">
                    <xsl:value-of select="$givenContinuousMedAdmins[(n:order/@order-id=$orderId)][1]/@event-id"/>
                </xsl:attribute>
                <xsl:attribute name="dd:contenttype">
                    <xsl:text>MEDS_ADMIN</xsl:text>
                </xsl:attribute>
                <xsl:value-of select="@clinical-name"/>
                
                <!-- One Medication Order can have many Ingredients -->
                <!-- If a medication has more than one ingredient, we display the clinical name only-->
                <xsl:if test="count(n:medication-ingredient)&lt;= 1">
                    
                    <!-- Dose -->
                    <xsl:variable name="Dose" as="xs:string">
                        <xsl:choose>
                            <!-- Strength -->
                            <xsl:when test="n:medication-ingredient/n:dose[@strength-unit-code]">		
                                <!-- Remove Trailing Zeros based on Locale -->
                                <xsl:variable name="Strength" select="cdocfx:removeTrailingZeros(n:medication-ingredient/n:dose/@strength, $SystemLocale)"/>
                                <xsl:variable name="sUnit" as="xs:string" select="cdocfx:getCodeDisplayByID(n:medication-ingredient/n:dose/@strength-unit-code)"/>
                                <xsl:value-of select="java-string:format($Connect, ($Strength, $sUnit))"/>
                            </xsl:when>
                            <!-- Volume -->
                            <xsl:when test="n:medication-ingredient/n:dose[@volume-unit-code]">
                                <!-- Remove Trailing Zeros based on Locale -->
                                <xsl:variable name="Volume" select="cdocfx:removeTrailingZeros(n:medication-ingredient/n:dose/@volume, $SystemLocale)"/>
                                <xsl:variable name="sUnit" as="xs:string" select="cdocfx:getCodeDisplayByID(n:medication-ingredient/n:dose/@volume-unit-code)"/>
                                <xsl:value-of select="java-string:format($Connect, ($Volume, $sUnit))"/>
                            </xsl:when>
                            <!-- Free Text Dose -->
                            <xsl:when test="n:medication-ingredient/n:dose[@freetext-dose]">
                                <xsl:value-of select="n:medication-ingredient/n:dose/@freetext-dose"/>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:value-of select="''"/>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:variable>
                    
                    <xsl:if test="$Dose != ''">	
                        <xsl:value-of select="java-string:format($Separator, $Dose)"/> 
                    </xsl:if> 
                </xsl:if>
                
                <!-- Route of administration -->
                <xsl:if test="@route-of-administration-code">
                    <xsl:variable name="sRouteAdministration" as="xs:string" select="cdocfx:getCodeDisplayByID(@route-of-administration-code)"/>
                    <xsl:value-of select="java-string:format($Separator, $sRouteAdministration)"/>
                </xsl:if>
                
                <!-- Display diagnoses or indication associated with the order -->
                <xsl:call-template name="DisplayDiagnosisOrIndication">
                    <xsl:with-param name="order" select="."/>
                    <xsl:with-param name="diagnoses" select="$diagnoses"/>
                </xsl:call-template>  
            </div>
        </xsl:for-each>
    </xsl:template>
    
    <xsl:template name="DisplayNonContinuousMedAdmins">
        <xsl:param name="givenNonContinuousMedAdmins"/>
        <xsl:param name="givenNonContinuousMedAdminOrders"/>
        <xsl:param name="diagnoses"/>
        
        <xsl:for-each select="$givenNonContinuousMedAdmins">
            <xsl:sort select="fn:upper-case(cdocfx:getNonContinuousMedAdminDisplay(.))" order="ascending"/>
        
           <div class="ddemrcontentitem ddremovable" style="margin-left: 1em; padding-left:1em; text-indent:-1em;">
                <xsl:attribute name="dd:entityid">
                    <xsl:value-of select="@event-id"/>
                </xsl:attribute>
                <xsl:attribute name="dd:contenttype">
                    <xsl:text>MEDS_ADMIN</xsl:text>
                </xsl:attribute>
                
                <xsl:choose>
                    <!-- One Medication Order can have many Ingredients -->
                    <!-- If a medication has single ingredient, we display clinical name and dose from when it was administered. -->
                    <xsl:when test="count(n:medication-ingredient)&lt;= 1">         
                        <xsl:value-of select="n:medication-ingredient/n:order-synonym/@name"/>      
                        
                        <!-- Dose -->
                        <xsl:variable name="Dose" as="xs:string">
                            <xsl:value-of select="cdocfx:getMedicationIngredientDose(n:medication-ingredient)"/>
                        </xsl:variable>  
                        <xsl:if test="$Dose != ''">	
                            <xsl:value-of select="java-string:format($Separator, $Dose)"/> 
                        </xsl:if> 
                    </xsl:when>
                    <!-- If a medication has multiple ingredients, we build out the clinical name and dose ourselves in the following format:
                                clinical name, dose + clinical name, dose + clinical name, dose.. etc -->
                    <xsl:otherwise>   
                        <xsl:for-each select="n:medication-ingredient">        
                            <xsl:value-of select="n:order-synonym/@name"/>
                            
                            <!-- Dose -->
                            <xsl:variable name="Dose" as="xs:string">
                                <xsl:value-of select="cdocfx:getMedicationIngredientDose(.)"/>
                            </xsl:variable>            
                            <xsl:if test="$Dose != ''">	
                                <xsl:text disable-output-escaping="yes"><![CDATA[&#160;]]></xsl:text>
                                <xsl:value-of select="$Dose"/> 
                            </xsl:if> 
                            
                            <xsl:if test="fn:not(fn:position() = fn:last())">
                                <xsl:text disable-output-escaping="yes"><![CDATA[&#160;]]>+<![CDATA[&#160;]]></xsl:text>
                            </xsl:if>
                        </xsl:for-each>
                    </xsl:otherwise>
                </xsl:choose>
                        
                <!-- Route of administration -->
                <xsl:if test="@route-code">
                    <xsl:variable name="sRouteAdministration" as="xs:string" select="cdocfx:getCodeDisplayByID(@route-code)"/>
                    <xsl:value-of select="java-string:format($Separator, $sRouteAdministration)"/>
                </xsl:if>
                
               <!-- Get the medication order corresponding to non continuous med admin -->
                <xsl:variable name="OrderId" select="n:order/@order-id"/>
                <xsl:variable name="TemplateOrderId" select="n:order/@template-order-id"/>        
                <xsl:variable name="Order" select="$givenNonContinuousMedAdminOrders[(@order-id = $OrderId) or
                                                   (@order-id = $TemplateOrderId)]"/>
               
               <!-- Display diagnoses or indication associated with the order --> 
               <xsl:call-template name="DisplayDiagnosisOrIndication">
                    <xsl:with-param name="order" select="$Order"/>
                    <xsl:with-param name="diagnoses" select="$diagnoses"/>
                </xsl:call-template>     

            </div>
        </xsl:for-each>
    </xsl:template>
    
    <!-- Get display of the given non continuous med admin. Use medication ingredient order synonym name -->
    <!-- If there are multiple ingredients for a med, we use the first encountered medication ingredient -->
    <!-- Parameters: -->
    <!--	NonContinuousMedAdmin - given non continuous meds admin -->
    <xsl:function name="cdocfx:getNonContinuousMedAdminDisplay" as="xs:string">
        <xsl:param name="NonContinuousMedAdmin"/>
        <xsl:choose>
            <xsl:when test="count($NonContinuousMedAdmin/n:medication-ingredient)&lt;= 1">
                <xsl:value-of select="$NonContinuousMedAdmin/n:medication-ingredient/n:order-synonym/@name"/>
            </xsl:when>
            <xsl:when test="count($NonContinuousMedAdmin/n:medication-ingredient)&gt; 1">
                <xsl:value-of select="$NonContinuousMedAdmin/n:medication-ingredient[1]/n:order-synonym/@name"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="''"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>
    
    <!-- Get dose of the given non continuous med admin. Use medication ingredient dose information -->
    <!-- Parameters: -->
    <!--	MedicationIngredient - medication ingredient element of given non continuous meds admin -->
    <xsl:function name="cdocfx:getMedicationIngredientDose" as="xs:string">
        <xsl:param name="MedicationIngredient"/>
        
            <xsl:choose>
                <!-- Dose -->
                <xsl:when test="$MedicationIngredient/n:dose[@unit-code]">
                    <!-- Remove Trailing Zeros based on Locale -->
                    <xsl:variable name="dose" select="cdocfx:removeTrailingZeros($MedicationIngredient/n:dose/@value, $SystemLocale)"/>
                    <xsl:variable name="sUnit" as="xs:string" select="cdocfx:getCodeDisplayByID($MedicationIngredient/n:dose/@unit-code)"/>
                    <xsl:value-of select="java-string:format($Connect, ($dose, $sUnit))"/>
                </xsl:when>
                <!-- Initial Dose -->
                <xsl:when test="$MedicationIngredient/n:initial-dose[@unit-code]">
                    <!-- Remove Trailing Zeros based on Locale -->
                    <xsl:variable name="initialDose" select="cdocfx:removeTrailingZeros($MedicationIngredient/n:initial-dose/@value, $SystemLocale)"/>
                    <xsl:variable name="sUnit" as="xs:string" select="cdocfx:getCodeDisplayByID($MedicationIngredient/n:initial-dose/@unit-code)"/>
                    <xsl:value-of select="java-string:format($Connect, ($initialDose, $sUnit))"/>
                </xsl:when>
                <!-- Volume -->
                <xsl:when test="$MedicationIngredient/n:volume[@unit-code]">		
                    <!-- Remove Trailing Zeros based on Locale -->
                    <xsl:variable name="Volume" select="cdocfx:removeTrailingZeros($MedicationIngredient/n:volume/@value, $SystemLocale)"/>
                    <xsl:variable name="sUnit" as="xs:string" select="cdocfx:getCodeDisplayByID($MedicationIngredient/n:volume/@unit-code)"/>
                    <xsl:value-of select="java-string:format($Connect, ($Volume, $sUnit))"/>
                </xsl:when>
                <!-- Volume -->
                <xsl:when test="$MedicationIngredient/n:initial-volume[@unit-code]">		
                    <!-- Remove Trailing Zeros based on Locale -->
                    <xsl:variable name="initialVolume" select="cdocfx:removeTrailingZeros($MedicationIngredient/n:initial-volume/@value, $SystemLocale)"/>
                    <xsl:variable name="sUnit" as="xs:string" select="cdocfx:getCodeDisplayByID($MedicationIngredient/n:initial-volume/@unit-code)"/>
                    <xsl:value-of select="java-string:format($Connect, ($initialVolume, $sUnit))"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="''"/>
                </xsl:otherwise>
            </xsl:choose>    
    </xsl:function>
    
    <xsl:template name="DisplayDiagnosisOrIndication">
        <xsl:param name="order"/>
        <xsl:param name="diagnoses"/>
        
        <xsl:choose>
            <xsl:when test="$order/n:diagnosis">
                <xsl:variable name="id" select="$order/n:diagnosis/@id"/>
                <span class="ddremovable">
                    <xsl:value-of select="java-string:format($Period, $For)"/>
                </span>
                <xsl:call-template name="DisplayDiagnoses">
                    <xsl:with-param name="dxList" select="$diagnoses/*[(@id=$id) and (@is-active='true')]"/>
                </xsl:call-template>
            </xsl:when>
            
            <xsl:when test="$order/n:indication">
                <span class="ddremovable">
                    <xsl:value-of select="java-string:format($Period, $For)"/>
                </span>
                <xsl:for-each select="$order/n:indication">
                    <xsl:choose>
                        <xsl:when test="n:code">
                            <span class="ddremovable">
                                <xsl:if test="fn:not(fn:position() = 1)">
                                    <xsl:text disable-output-escaping="yes">,<![CDATA[&#160;]]></xsl:text>
                                </xsl:if>
                                <xsl:value-of select="cdocfx:getCodeDisplayByID(n:code)"/>
                            </span>
                        </xsl:when>
                        <xsl:when test="n:freetext">
                            <span class="ddremovable">
                                <xsl:if test="fn:not(fn:position() = 1)">
                                    <xsl:text disable-output-escaping="yes">,<![CDATA[&#160;]]></xsl:text>
                                </xsl:if>
                                <xsl:value-of select="n:freetext" />
                            </span>
                        </xsl:when>	
                        <xsl:otherwise>
                            <xsl:value-of select="''"/>
                        </xsl:otherwise>
                    </xsl:choose>          
                </xsl:for-each>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="''"/>
            </xsl:otherwise>
        </xsl:choose>    
    </xsl:template>
    
    <xsl:template name="DisplayImmunization">
        <xsl:param name = "Immunization"/>
        
        <div class="ddemrcontentitem ddremovable" style="margin-left: 1em; padding-left:1em; text-indent:-1em;">
            <xsl:attribute name="dd:entityid">
                <xsl:if test="$Immunization/@event-id">	
                    <xsl:value-of select="$Immunization/@event-id"/>
                </xsl:if>	
            </xsl:attribute>
            <xsl:attribute name="dd:contenttype">
                <xsl:text>IMMUNZTNS_V2</xsl:text>
            </xsl:attribute>
            
            <xsl:if test="$Immunization/@event-display">
                <xsl:value-of select="$Immunization/@event-display"/>
            </xsl:if>
     
            <xsl:choose>
                <xsl:when test="$Immunization/@status='given'">
                    <xsl:if test="$Immunization/@route">
                        <xsl:variable name="routeAdmin" as="xs:string" select="$Immunization/@route"/>
                        <xsl:value-of select="java-string:format($Separator, $routeAdmin)"/>
                    </xsl:if>
                </xsl:when>
                <xsl:when test="$Immunization/@status='not-given'">
                    <xsl:if test="$Immunization/@not-given-reason">
                        <xsl:variable name="notGivenReason" as="xs:string" select="$Immunization/@not-given-reason"/>
                        <xsl:value-of select="java-string:format($Separator, $notGivenReason)"/>
                    </xsl:if>
                </xsl:when>
            </xsl:choose>
            
            <xsl:if test="$Immunization/comment">
                <xsl:text disable-output-escaping="yes">,<![CDATA[&#160;]]></xsl:text>
                <xsl:for-each select="$Immunization/comment">
                    <xsl:variable name="Comment" as="xs:string">
                        <xsl:value-of select="."/>
                    </xsl:variable>
                    <xsl:value-of disable-output-escaping="yes" select="doc:convertPlainTextToHtml($Comment)"/>
                    <xsl:if test="fn:not(fn:position() = fn:last())">
                        <xsl:text disable-output-escaping="yes">,<![CDATA[&#160;]]></xsl:text>
                    </xsl:if>
                </xsl:for-each>
            </xsl:if>
        </div>
    </xsl:template>
    
    <xsl:template name="DisplayDiagnoses">
        <xsl:param name="dxList"/>
        
        <xsl:for-each select="$dxList">
            <xsl:sort select="cdocfx:getDxPriority(.)" order="ascending"/>
            <xsl:sort select="fn:upper-case(cdocfx:getDxDisplay(.))" order="ascending"/>
            
            <span class="ddemrcontentitem ddremovable">
                <!-- Format diagnosis item -->
                <xsl:attribute name="dd:entityid">
                    <xsl:value-of select="@id"/>
                </xsl:attribute>
                <xsl:attribute name="dd:contenttype">
                    <xsl:text>DIAGNOSES</xsl:text>
                </xsl:attribute>
                <xsl:if test="fn:not(fn:position() = 1)">
                    <xsl:text disable-output-escaping="yes">,<![CDATA[&#160;]]></xsl:text>
                </xsl:if>
                <xsl:value-of select="cdocfx:getDxDisplay(.)"/>
            </span>
        </xsl:for-each>
    </xsl:template>

</xsl:stylesheet>
